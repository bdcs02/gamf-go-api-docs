/* eslint-disable @typescript-eslint/indent */
/* eslint-disable arrow-parens */
import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ZipArchive } from '@shortercode/webzip';
import { saveAs } from 'file-saver';
import { AuthorizationForm, FileObjectForm, GeneralForm, GeneratorForm, LocustEndpointForm, ModulForm, TypeForm } from './generator-form';
import { generalTemplate } from './python-templates/locust-general-template';
import { dockerTemplate } from './python-templates/locust-docker-template';
import { locustfileTemplate } from './python-templates/locustfile-template';
import { modulTemplate } from './python-templates/modul/locust-modul-template';
import { authTemplate } from './python-templates/auth/locust-auth-base-template';
import { oauthTemplate } from './python-templates/auth/locust-oauth-template';
import { bearerTemplate } from './python-templates/auth/locust-bearer-template';
import { apiKeyTemplate } from './python-templates/auth/locust-api-key-template';
import { modulMethodTemplate } from './python-templates/modul/locust-modul-method';
import { createBlobFromBase64 } from 'rxdb';
import { GeneratorFactory } from 'src/app/utils/data-generator/factory/generator-factory';
import { randomList } from './locust-moduls/locust-modul-request-body/request-type/random-types';

@Injectable({
	providedIn: 'root'
})
export class ProjectGeneratorService {
	public generatorForm!: FormGroup<GeneratorForm>;
	private archive!: ZipArchive;
	private dataStructMap = new Map<string, FormGroup<TypeForm>[]>();

	constructor() {
		this.archive = new ZipArchive();
	}

	public async generate(form: FormGroup<GeneratorForm>): Promise<void> {
		this.generatorForm = form;

		this.archive.set_folder('assets');
		await this.generateAssetFiles(form.controls.files);

		this.archive.set_folder('modules');
		this.archive.set_folder('common');
		await this.archive.set('run_locust.sh', this.generateDockerFile());

		const imports = authTemplate;
		let methods = '';
		for (const auth of form.controls.auth.controls) {
			methods += this.generateAuth(auth);
		}
		await this.archive.set('common/auth.py', imports + methods);
		await this.archive.set('locust.conf', this.generateGeneral(form.controls.general));

		for (const modul of form.controls.modul.controls) {
			await this.archive.set(`modules/${modul.value.name}.py`, this.generateModul(modul, form));
		}
		await this.archive.set('locustfile.py', this.generateLocustFile(form));
		const blob = this.archive.to_blob();
		saveAs(blob, 'locust.zip');
	}

	public generateModul(modul: FormGroup<ModulForm>, generatorForm: FormGroup<GeneratorForm>): string {
		this.generatorForm = generatorForm;
		if (modul.value.enabled) {
			let modulString = modulTemplate;
			modulString = modulString.replace(/{{name}}/g, modul.value.name!.toString());
			modulString = modulString.replace(/{{tasks}}/g, this.generateTasks(modul.controls.endpoints, generatorForm));
			return modulString;
		}
		return '';
	}

	private generateLocustFile(form: FormGroup<GeneratorForm>): string {
		let locust = locustfileTemplate;
		locust = locust.replace(/{{imports}}/g, this.getModuleImports(form.controls.modul));
		locust = locust.replace(/{{tasks}}/g, this.getTasks(form.controls.modul));
		locust = locust.replace(/{{auth}}/g, this.createOAuthVariables(form.controls.auth));
		return locust;
	}

	private getModuleImports(form: FormArray<FormGroup<ModulForm>>): string {
		let modules = '';

		for (const modul of form.value) {
			if (modul.enabled) {
				modules += `from modules.${modul.name} import ${modul.name}\n`;
			}
		}

		return modules;
	}

	private getTasks(form: FormArray<FormGroup<ModulForm>>): string {
		let tasks = '';

		for (const modul of form.value) {
			for (const endpoint of modul.endpoints!) {
				if (modul.enabled) {
					tasks += `\t\t${modul.name}.${endpoint.name?.replace(/\//g, '_')},\n`;
				}
			}
		}

		return tasks;
	}

	private generateTasks(array: FormArray<FormGroup<LocustEndpointForm>>, form: FormGroup<GeneratorForm>): string {
		let methods = '';
		for (const endpoint of array.controls) {
			methods += this.generateTask(endpoint, form);
		}
		return methods;
	}

	private generateTask(endpoint: FormGroup<LocustEndpointForm>, form: FormGroup<GeneratorForm>): string {
		const general = form.controls.general;
		const auth = form.controls.auth;

		const endpointAuth = auth.controls.find((authType) => authType.controls.name.value === endpoint.controls.authType.value);

		let queryParam = '';
		const apiKeyInQueryParam = endpointAuth?.value.type === 'Api key' && endpointAuth?.value.apiKey?.position === 'Query param';
		if (apiKeyInQueryParam) {
			queryParam = `?${endpointAuth?.value.apiKey?.key}=${endpointAuth?.value.apiKey?.value}`;
		}

		let method = modulMethodTemplate;
		method = method.replace(/{{task}}/g, endpoint.controls.weight.value.toString());
		method = method.replace(/{{name}}/g, endpoint.controls.name.value.replace(/\//g, '_'));
		method = method.replace(/{{auth}}/g, !apiKeyInQueryParam ? `common.auth.${endpoint.controls.authType.value.replace(/ /g, '_')!}(self)` : '');
		method = method.replace(/{{faker}}/g, this.insertFakerInMethod(endpoint, general));
		method = method.replace(/{{call}}/g, this.callMethod(endpoint.controls, queryParam));
		method = method.replace(/{{responseHandler}}/g, this.generateResponseHandlers(endpoint.controls));
		return method;
	}

	private insertFakerInMethod(endpoint: FormGroup<LocustEndpointForm>, general: FormGroup<GeneralForm>): string {
		if (endpoint.controls?.dataStructure.controls[0]?.controls.data.controls) {
			for (const data of endpoint.controls.dataStructure.controls[0].controls.data.controls) {
				if (data.controls.valueType.value === 'Faker') {
					return `fake = Faker('${general.controls.locale.value}')\n\t\tFaker.seed(${general.controls.seed.value})`;
				}
			}
		}
		return '';
	}

	private callMethod(endpoint: LocustEndpointForm, queryParam: string): string {
		return `\n\t\tresp = self.client.${endpoint.method.value.toLocaleLowerCase()}("${endpoint.path.value}${queryParam}"${this.getRequestBody(
			endpoint
		)})`;
	}

	private parseValue(value: string, type?: string): any | null {
		if (type === 'Null') {
			return 'None';
		}

		if (value === 'true') {
			return 'True';
		}
		if (value === 'false') {
			return 'False';
		}

		if (type === 'Szöveg' || type === 'string') {
			return JSON.stringify(value);
		}

		const parsedNumber = parseFloat(value);
		if (!isNaN(parsedNumber)) {
			return parsedNumber;
		}

		try {
			return JSON.parse(value);
		} catch (e) {
			return value;
		}
	}

	private getRequestBody(endpoint: LocustEndpointForm): string {
		if (endpoint.dataStructure.controls?.length > 0) {
			for (let i = 1; i < endpoint.dataStructure.controls.length; i++) {
				this.dataStructMap.set(endpoint.dataStructure.controls[i].value.name!, endpoint.dataStructure.controls[i].controls.data.controls);
			}
		}

		if (endpoint.dataStructure.length > 0) {
			let request = '\n\t\t{';
			for (const struct of endpoint.dataStructure.controls[0].controls.data.controls) {
				request += this.bodyString(struct, 0);
			}
			return `, json=${request}\n\t\t}`;
		} else {
			return '';
		}
	}

	private bodyString(struct: FormGroup<TypeForm>, level: number): string {
		let indent = '\t\t\t';
		for (let i = 0; i < level; i++) {
			indent += '\t';
		}

		if (!this.dataStructMap.get(struct.value.valueType!)) {
			let value = `\n${indent}"${struct.value.name!}":${struct.value.length! > 1 || struct.value.type === 'slice' ? ' [' : ''}`;

			for (let i = 0; i < struct.value.length!; i++) {
				if (struct.value.valueType !== 'Faker' && struct.value.valueType !== 'Random') {
					value += ` ${this.parseValue(struct.value.value!, struct.value.valueType)},`;
				} else if (struct.value.valueType === 'Faker') {
					value += ` ${this.generateFakerBody(struct)},`;
				} else if (struct.value.valueType === 'Random') {
					if (struct.value.value === 'Szótár') {
						value += ` "${this.getRandomWordFormDictionary(struct.value.randomValueSetting!)}",`;
					} else {
						value += ` ${this.getRandomGenerator(struct)},`;
					}
				}
			}

			return `${value}${struct.value.length! > 1 || struct.value.type === 'slice' ? ' ],' : ''}`;
		} else {
			let innerBody = `\n${indent}"${struct.value.name!}": {`;
			for (const data of this.dataStructMap.get(struct.value.valueType!)!) {
				innerBody += `${this.bodyString(data, level + 1)}`;
			}
			return `${innerBody}\n${indent}},`;
		}
	}

	private getRandomGenerator(struct: FormGroup<TypeForm>): string {
		const generatorFactory: GeneratorFactory = new GeneratorFactory();
		const randomValue = randomList.filter((random) => random.name === struct.value.value!)[0];
		if (randomValue.option) {
			randomValue.optionsMap!.set(randomValue.option, struct.value.randomValueSetting);
		}

		const generator = generatorFactory.getGenerator(
			randomValue.generatorType!,
			randomValue.optionsMap!,
			undefined,
			this.generatorForm.controls.general
		);
		return this.parseValue(generator.generate(), randomValue.type);
	}

	private randomInt(min: number, max: number): number {
		let seed = this.generatorForm.value.general!.seed!;
		seed = (seed * 9301 + 49297) % 233280;
		const rnd = seed / 233280;

		return Math.floor(rnd * (max - min + 1)) + min;
	}

	private getRandomWordFormDictionary(name: string): string {
		const dictionaries = this.generatorForm.controls.dictionaries;
		const selected = dictionaries.value.filter((dict) => dict.name === name)[0].words!;
		return selected[this.randomInt(0, selected.length)].word!;
	}

	private generateFakerBody(struct: FormGroup<TypeForm>): any {
		let params = '';
		for (const param of struct.value.fakerType!) {
			if (param.value !== '') {
				params += `${param.name}=${this.parseValue(param.value!)},`;
			}
		}
		return `fake.${struct.value.fakerValue!}(${params})`;
	}

	private generateResponseHandlers(endpoint: LocustEndpointForm): string {
		let response = '';

		for (const handler of endpoint.responseHandler.value) {
			switch (handler.equality) {
				case 'Egyenlő': {
					response += `\n\t\tif resp.status_code == ${handler.statusCode?.split(':')[0]}:`;
					break;
				}
				case 'Nem egyenlő': {
					response += `\n\t\tif resp.status_code != ${handler.statusCode?.split(':')[0]}:`;
					break;
				}
				case 'Kisebb': {
					response += `\n\t\tif resp.status_code > ${handler.statusCode?.split(':')[0]}:`;
					break;
				}
				case 'Nagyobb': {
					response += `\n\t\tif resp.status_code < ${handler.statusCode?.split(':')[0]}:`;
					break;
				}
				case 'Kisebb egyenlő': {
					response += `\n\t\tif resp.status_code >= ${handler.statusCode?.split(':')[0]}:`;
					break;
				}
				case 'Nagyobb egyenlő': {
					response += `\n\t\tif resp.status_code <= ${handler.statusCode?.split(':')[0]}:`;
					break;
				}
			}
			if (handler.log) {
				response += `\n\t\t\tlogging.info("${endpoint.name.value} {}".format(resp.json()))`;
			}
		}
		return response;
	}

	private generateGeneral(form: FormGroup<GeneralForm>): string {
		let general = generalTemplate;
		general = general.replace(/{{headless}}/g, form.value.headless!.toString());
		general = general.replace(/{{host}}/g, form.value.host!.toString());
		general = general.replace(/{{logLevel}}/g, form.value.logLevel!.toString());
		general = general.replace(/{{userNumber}}/g, form.value.userNumber!.toString());
		general = general.replace(/{{spawnRate}}/g, form.value.spawnRate!.toString());
		general = general.replace(/{{runTime}}/g, form.value.runTime!.toString());
		return general;
	}

	private generateAuth(auth: FormGroup<AuthorizationForm>): string {
		let authtype = '\n';
		switch (auth.controls.type.value) {
			case 'OAuth': {
				authtype += oauthTemplate;
				authtype = authtype.replace(/{{name}}/g, auth.controls.name.value.replace(/ /g, '_').toString());
				authtype = authtype.replace(/{{url}}/g, auth.controls.oAuth.value.url!.toString());
				authtype = authtype.replace(/{{clientID}}/g, auth.controls.oAuth.value.clientID!.toString());
				authtype = authtype.replace(/{{responseType}}/g, auth.controls.oAuth.value.responseType!.toString());
				authtype = authtype.replace(/{{grantType}}/g, auth.controls.oAuth.value.grantType!.toString());
				authtype = authtype.replace(/{{username}}/g, auth.controls.oAuth.value.username!.toString());
				authtype = authtype.replace(/{{password}}/g, auth.controls.oAuth.value.password!.toString());
				break;
			}
			case 'Bearer Token': {
				authtype += bearerTemplate;
				authtype = authtype.replace(/{{name}}/g, auth.controls.name.value.replace(/ /g, '_').toString());
				authtype = authtype.replace(/{{token}}/g, auth.controls.bearerToken.controls.token.value.toString());
				break;
			}
			case 'Api key': {
				if (auth.controls.apiKey.controls.position.value === 'Header') {
					authtype += apiKeyTemplate;
					authtype = authtype.replace(/{{name}}/g, auth.controls.name.value.replace(/ /g, '_').toString());
					authtype = authtype.replace(/{{key}}/g, auth.controls.apiKey.controls.key.value.toString());
					authtype = authtype.replace(/{{value}}/g, auth.controls.apiKey.controls.value.value.toString());
				}
				break;
			}
		}
		return authtype;
	}

	private createOAuthVariables(form: FormArray<FormGroup<AuthorizationForm>>): string {
		let variables = '';
		for (const auth of form.value) {
			if (auth.type === 'OAuth') {
				variables += `${auth.name!.replace(/ /g, '_')}_oauth_token = {}\n\t`;
			}
		}
		return variables;
	}

	private async generateAssetFiles(form: FormArray<FormGroup<FileObjectForm>>): Promise<void> {
		for (const file of form.controls) {
			const fileValue = file.controls.value.value;
			await this.archive.set(`assets/${fileValue.name}`, await createBlobFromBase64(fileValue.content, fileValue.type));
		}
	}

	private generateDockerFile(): string {
		return dockerTemplate;
	}
}
