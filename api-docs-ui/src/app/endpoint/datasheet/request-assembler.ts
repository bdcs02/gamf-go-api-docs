/* eslint-disable arrow-parens */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormGroup } from '@angular/forms';
import { ApiService } from '../api.service';
import { EndpointForm, FileObject } from './endpoint-form';
import { Endpoint } from '../api';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { DatabaseService } from 'src/app/database/database.service';
import { DgPatternReader } from 'src/app/utils/data-generator/pattern-reader/dg-pattern-reader';
import { GeneratorFactory } from 'src/app/utils/data-generator/factory/generator-factory';

export type ResponseType = 'json' | 'text' | 'blob' | 'arraybuffer' | undefined;

export class RequestAssembler {
	public httpParams: HttpParams = new HttpParams();
	public headers: HttpHeaders = new HttpHeaders();

	public BYTE_STREAM_TYPE = '[]uint8';

	public globalVariables!: any;
	private readonly genFactory: GeneratorFactory = new GeneratorFactory();
	private readonly patternReader: DgPatternReader = new DgPatternReader();

	constructor(
		private readonly apiService: ApiService,
		private readonly formGroup: FormGroup<EndpointForm>,
		private readonly database: DatabaseService
	) {}

	public async sendRequest(endpoint: Endpoint | undefined): Promise<Observable<HttpResponse<any>>> {
		this.clearData();
		const rxDocs = await this.database.getGlobals();
		this.globalVariables = rxDocs;
		if (endpoint) {
			const requestBody = await this.assembleRequestBody();
			await this.assembleAuthorizationData();
			await this.getHeaders();
			await this.getParams();
			return this.apiService.sendRequest(
				(await this.applyVariables(this.formGroup.controls.url.value)) as string,
				endpoint.method,
				requestBody,
				this.headers,
				this.httpParams,
				this.getResponseType(endpoint)
			);
		}

		return of();
	}

	public async assembleRequestBody(): Promise<any> {
		const body = this.formGroup.getRawValue().requestBody;
		switch (body.type) {
			case 'Nincs': {
				break;
			}
			case 'Form Data': {
				const formData: FormData = new FormData();
				for (const formElement of this.formGroup.value.requestBody!.formFileData!) {
					if (formElement.formDataType === 'Fájl') {
						formData.append((await this.applyVariables(formElement.key!)) as string, (formElement.value as FileObject).content as Blob);
					}
					if (formElement.formDataType === 'Form Data') {
						if (formElement.key !== '') {
							formData.append(
								(await this.applyVariables(formElement.key!)) as string,
								(await this.applyVariables(formElement.value as string)) as string
							);
						}
					}
				}
				return formData;
			}
			case 'JSON': {
				return this.applyVariables(body.bodyString);
			}
			case 'Szöveg': {
				return this.applyVariables(body.bodyString);
			}
		}

		return null;
	}

	public async assembleAuthorizationData(): Promise<void> {
		const auth = this.formGroup.getRawValue().authorization;

		switch (auth.type) {
			case 'API Key': {
				if (auth.placement === 'Header') {
					let key = await this.applyVariables(auth.key);
					key = String(key).replace(/\s+/g, '-');
					if (key !== '') {
						this.headers = this.headers.append(key, (await this.applyVariables(auth.value)) as string);
					}
				} else if (auth.placement === 'URL paraméter') {
					this.httpParams = this.httpParams.append(
						(await this.applyVariables(auth.key)) as string,
						(await this.applyVariables(auth.value)) as string
					);
				}
				break;
			}
			case 'Bearer Token': {
				const token = await this.applyVariables(auth.value);
				this.headers = this.headers.append('Authorization', `Bearer ${token}`);
				break;
			}
		}
	}

	public async getParams(): Promise<void> {
		for (const param of this.formGroup.getRawValue().params) {
			if (param.key !== '') {
				this.httpParams = this.httpParams.append(
					(await this.applyVariables(param.key)) as string,
					(await this.applyVariables(param.value)) as string
				);
			}
		}
	}

	public async getHeaders(): Promise<void> {
		for (const header of this.formGroup.controls.headers.value) {
			if (header.key && header.key !== '' && header.value) {
				const key = (await this.applyVariables(header.key)) as string;
				this.headers = this.headers.append(key.replace(/\s+/g, '-'), (await this.applyVariables(header.value)) as string);
			}
		}
	}

	public async applyVariables(text: string | null): Promise<string | null> {
		if (text === null) {
			return null;
		}

		if (!this.formGroup.getRawValue().variables.enabled) {
			return text;
		}

		this.patternReader.processPatterns(text).map((item) => {
			const data = this.genFactory.getGenerator(item.type, item.options, this.formGroup.controls.settings).generate();
			text = text!.replace(item.root, `"${data}"`);
		});

		for (const variable of this.formGroup.getRawValue().variables.variables) {
			if (variable.key) {
				const regex = new RegExp('\\$\\{' + variable.key + '\\}', 'g');
				text = text.replace(regex, variable.value);
			}
		}

		const glob = await this.database.getGlobals();
		glob.forEach((variable) => {
			if (variable.key && !this.formGroup.getRawValue().variables.variables.some((item) => item.key === variable.key)) {
				const regex = new RegExp('\\$\\{' + variable.key + '\\}', 'g');
				text = text!.replace(regex, variable.value);
			}
		});

		return text;
	}

	public clearData(): void {
		this.headers = new HttpHeaders();
		this.httpParams = new HttpParams();
	}

	public getResponseType(endpoint: Endpoint): ResponseType {
		if (endpoint?.responseType?.type === this.BYTE_STREAM_TYPE) {
			return 'blob';
		}

		if (endpoint.contentType === 'application/json') {
			return 'json';
		}

		return 'text';
	}
}
