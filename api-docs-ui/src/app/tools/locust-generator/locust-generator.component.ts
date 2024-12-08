/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line max-len
import {
	ApiKeyForm,
	ApiKeyPosition,
	AuthTypes,
	AuthorizationForm,
	BearerForm,
	DictionaryForm,
	FakerTypeForm,
	FileObjectForm,
	GeneralForm,
	GeneratorForm,
	LocustEndpointForm,
	ModulForm,
	OAuthForm,
	ResponseHandlerForm,
	TypeArrayForm,
	TypeForm,
	TypeFormTypes,
	WordForm
} from './generator-form';
import { DatabaseService } from 'src/app/database/database.service';
import { saveAs } from 'file-saver';
import { animate, style, transition, trigger } from '@angular/animations';
import { ProjectGeneratorService } from './project-generator.service';

@Component({
	selector: 'locust-generator',
	templateUrl: './locust-generator.component.html',
	styleUrl: './locust-generator.component.scss',
	animations: [
		trigger('inOutAnimation', [
			transition(':enter', [
				style({ transform: 'translateX(-100%)', opacity: 0 }),
				animate('200ms ease-in', style({ transform: 'translateY(0%)', opacity: 1 }))
			]),
			transition(':leave', [animate('200ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 }))])
		])
	]
})
export class LocustGeneratorComponent implements OnInit {
	@ViewChild('fileInput') fileInput!: ElementRef;
	public locust!: any;
	public title: string = this.translateService.instant('navigation.locust.generator');
	public generatorForm!: FormGroup<GeneratorForm>;

	constructor(
		private readonly translateService: TranslateService,
		private readonly formBuilder: FormBuilder,
		private readonly database: DatabaseService,
		private readonly projectGenerator: ProjectGeneratorService
	) {}

	public async ngOnInit(): Promise<void> {
		await this.loadForm().then(() => {
			if (this.locust) {
				const authLength = this.locust?.config.auth ? this.locust.config.auth.length : 1;
				const filesLength = this.locust?.config.files ? this.locust.config.files.length : 1;
				this.generatorForm = this.createForm(this.locust.config.modul, authLength, filesLength, this.locust.config.dictionaries);
				this.generatorForm.patchValue(this.locust.config);
			} else {
				this.generatorForm = this.createForm();
			}
		});
	}

	public async generate(): Promise<void> {
		await this.projectGenerator.generate(this.generatorForm);
	}

	public async saveForm(): Promise<void> {
		this.generatorForm.markAsPristine();
		await this.database.insertLocust(this.generatorForm.value as unknown as GeneratorForm);
	}

	public async loadForm(): Promise<void> {
		this.locust = await this.database.getLocust();
	}

	public exportForm(): void {
		const res = JSON.stringify(this.generatorForm.value, null, '\t');
		const blob = new Blob([res], { type: 'application/json' });
		saveAs(blob, 'locust.json');
	}

	public openFile(event: any): void {
		const input = event.target;
		const reader = new FileReader();
		reader.onload = () => {
			if (reader.result) {
				this.generatorForm.patchValue(JSON.parse(reader.result as string));
			}
		};
		reader.readAsText(input.files[0], 'utf-8');
	}

	public importForm(): void {
		this.fileInput.nativeElement.click();
	}

	private createForm(
		moduls: ModulForm[] = [],
		authCount: number = 1,
		filesCount: number = 1,
		dictionaries: DictionaryForm[] = []
	): FormGroup<GeneratorForm> {
		return new FormGroup<GeneratorForm>({
			general: new FormGroup<GeneralForm>({
				headless: this.formBuilder.control(true, { nonNullable: true }),
				host: this.formBuilder.control('Url', { nonNullable: true }),
				spawnRate: this.formBuilder.control(10, { nonNullable: true }),
				userNumber: this.formBuilder.control(1, { nonNullable: true }),
				logLevel: this.formBuilder.control('INFO', { nonNullable: true }),
				runTime: this.formBuilder.control(5, { nonNullable: true }),
				seed: this.formBuilder.control(1000, { nonNullable: true }),
				locale: this.formBuilder.control('hu-HU', { nonNullable: true })
			}),
			modul: this.formBuilder.array<FormGroup<ModulForm>>(this.createEmptyModulFormArray(moduls)),
			auth: this.formBuilder.array<FormGroup<AuthorizationForm>>(this.createEmptyAuthFormArray(authCount)),
			files: this.formBuilder.array<FormGroup<FileObjectForm>>(this.createEmptyFilesFormArray(filesCount)),
			dictionaries: this.formBuilder.array<FormGroup<DictionaryForm>>(this.createEmptyDictionariesFormArray(dictionaries))
		});
	}

	private createEmptyModulFormArray(moduls: ModulForm[]): FormGroup<ModulForm>[] {
		const array: FormGroup<ModulForm>[] = [];
		if (moduls.length === 0) {
			array.push(
				new FormGroup<ModulForm>({
					enabled: this.formBuilder.control(true, { nonNullable: true }),
					id: this.formBuilder.control(0, { nonNullable: true }),
					name: this.formBuilder.control('modul', { nonNullable: true }),
					endpoints: this.formBuilder.array<FormGroup<LocustEndpointForm>>(this.createEmptyLocustEndpointsFormArray([]))
				})
			);
		}

		for (const modul of moduls) {
			array.push(
				new FormGroup<ModulForm>({
					enabled: this.formBuilder.control(true, { nonNullable: true }),
					id: this.formBuilder.control(0, { nonNullable: true }),
					name: this.formBuilder.control('modul', { nonNullable: true }),
					endpoints: this.formBuilder.array<FormGroup<LocustEndpointForm>>(this.createEmptyLocustEndpointsFormArray(modul.endpoints))
				})
			);
		}
		return array;
	}

	private createEmptyLocustEndpointsFormArray(endpoints: any): FormGroup<LocustEndpointForm>[] {
		const array: FormGroup<LocustEndpointForm>[] = [];
		if (endpoints) {
			for (let i = 0; i < endpoints.length; i++) {
				array.push(
					new FormGroup<LocustEndpointForm>({
						id: this.formBuilder.control(i, { nonNullable: true }),
						name: this.formBuilder.control('', { nonNullable: true }),
						method: this.formBuilder.control('', { nonNullable: true }),
						weight: this.formBuilder.control(1, { nonNullable: true }),
						path: this.formBuilder.control('', { nonNullable: true }),
						authType: this.formBuilder.control('', { nonNullable: true }),
						dataStructure: this.formBuilder.array<FormGroup<TypeArrayForm>>(
							this.createEmptyDataStrutureFormArray(endpoints[i].dataStructure)
						),
						responseHandler: this.formBuilder.array<FormGroup<ResponseHandlerForm>>(
							this.createEmptyResponseHandlerFormArray(endpoints[i].responseHandler.length)
						)
					})
				);
			}
		}
		return array;
	}

	private createEmptyDataStrutureFormArray(dataStructures: any): FormGroup<TypeArrayForm>[] {
		const array: FormGroup<TypeArrayForm>[] = [];
		if (dataStructures) {
			for (const dataStruct of dataStructures) {
				array.push(
					new FormGroup<TypeArrayForm>({
						name: this.formBuilder.control('', { nonNullable: true }),
						type: this.formBuilder.control('default', { nonNullable: true }),
						data: this.formBuilder.array<FormGroup<TypeForm>>(this.createEmptyTypeArrayFormArray(dataStruct.data)),
						deletable: this.formBuilder.control(dataStruct.deletable, { nonNullable: true })
					})
				);
			}
		}
		return array;
	}

	private createEmptyTypeArrayFormArray(data: any): FormGroup<TypeForm>[] {
		const array: FormGroup<TypeForm>[] = [];
		for (const type of data) {
			array.push(
				new FormGroup<TypeForm>({
					name: this.formBuilder.control('', { nonNullable: true }),
					type: this.formBuilder.control('', { nonNullable: true }),
					tag: this.formBuilder.control('', { nonNullable: true }),
					valueType: this.formBuilder.control(TypeFormTypes.Null, { nonNullable: true }),
					value: this.formBuilder.control('', { nonNullable: true }),
					randomValueSetting: this.formBuilder.control('', { nonNullable: true }),
					fakerValue: this.formBuilder.control('pystr', { nonNullable: true }),
					fakerType: this.formBuilder.array<FormGroup<FakerTypeForm>>(this.createEmptyFakerTypeFormArray(type.fakerType.length)),
					length: this.formBuilder.control(1, { nonNullable: true })
				})
			);
		}
		return array;
	}

	private createEmptyFakerTypeFormArray(count: number): FormGroup<FakerTypeForm>[] {
		const array: FormGroup<FakerTypeForm>[] = [];
		for (let i = 0; i < count; i++) {
			array.push(
				new FormGroup<FakerTypeForm>({
					name: this.formBuilder.control('', { nonNullable: true }),
					value: this.formBuilder.control('', { nonNullable: true })
				})
			);
		}
		return array;
	}

	private createEmptyResponseHandlerFormArray(count: number): FormGroup<ResponseHandlerForm>[] {
		const array: FormGroup<ResponseHandlerForm>[] = [];
		for (let i = 0; i < count; i++) {
			array.push(
				new FormGroup<ResponseHandlerForm>({
					equality: this.formBuilder.control('', { nonNullable: true }),
					statusCode: this.formBuilder.control('', { nonNullable: true }),
					log: this.formBuilder.control(true, { nonNullable: true })
				})
			);
		}
		return array;
	}

	private createEmptyAuthFormArray(count: number): FormGroup<AuthorizationForm>[] {
		const array: FormGroup<AuthorizationForm>[] = [];
		for (let i = 0; i < count; i++) {
			array.push(
				new FormGroup<AuthorizationForm>({
					name: this.formBuilder.control('defaultAuth', { nonNullable: true }),
					type: this.formBuilder.control(AuthTypes.OAuth, { nonNullable: true }),
					oAuth: new FormGroup<OAuthForm>({
						url: this.formBuilder.control('', { nonNullable: true }),
						clientID: this.formBuilder.control('', { nonNullable: true }),
						grantType: this.formBuilder.control('password', { nonNullable: true }),
						responseType: this.formBuilder.control('code', { nonNullable: true }),
						username: this.formBuilder.control('', { nonNullable: true }),
						password: this.formBuilder.control('', { nonNullable: true })
					}),
					bearerToken: new FormGroup<BearerForm>({
						token: this.formBuilder.control('', { nonNullable: true })
					}),
					apiKey: new FormGroup<ApiKeyForm>({
						key: this.formBuilder.control('', { nonNullable: true }),
						value: this.formBuilder.control('', { nonNullable: true }),
						position: this.formBuilder.control(ApiKeyPosition.Header, { nonNullable: true })
					})
				})
			);
		}
		return array;
	}

	private createEmptyFilesFormArray(count: number): FormGroup<FileObjectForm>[] {
		const array: FormGroup<FileObjectForm>[] = [];
		for (let i = 0; i < count; i++) {
			array.push(
				new FormGroup<FileObjectForm>({
					key: this.formBuilder.control('', { nonNullable: true }),
					value: this.formBuilder.control({ name: '', type: '', content: '' }, { nonNullable: true })
				})
			);
		}
		return array;
	}

	private createEmptyDictionariesFormArray(dictionaries: any): FormGroup<DictionaryForm>[] {
		const array: FormGroup<DictionaryForm>[] = [];
		if (dictionaries) {
			for (const dictionary of dictionaries) {
				array.push(
					new FormGroup<DictionaryForm>({
						name: this.formBuilder.control('', { nonNullable: true }),
						words: this.formBuilder.array<FormGroup<WordForm>>(this.createEmptyWordFormArray(dictionary.words.length))
					})
				);
			}
		}
		return array;
	}

	private createEmptyWordFormArray(words: number): FormGroup<WordForm>[] {
		const array: FormGroup<WordForm>[] = [];
		if (words) {
			for (let i = 0; i < words; i++) {
				array.push(
					new FormGroup<WordForm>({
						word: this.formBuilder.control('', { nonNullable: true })
					})
				);
			}
		}
		return array;
	}
}
