/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface GeneratorForm {
	general: FormGroup<GeneralForm>;
	modul: FormArray<FormGroup<ModulForm>>;
	auth: FormArray<FormGroup<AuthorizationForm>>;
	files: FormArray<FormGroup<FileObjectForm>>;
	dictionaries: FormArray<FormGroup<DictionaryForm>>;
}

export interface GeneralForm {
	headless: FormControl<boolean>;
	host: FormControl<string>;
	userNumber: FormControl<number>;
	spawnRate: FormControl<number>;
	logLevel: FormControl<string>;
	runTime: FormControl<number>;
	seed: FormControl<number>;
	locale: FormControl<string>;
}

export interface ModulForm {
	enabled: FormControl<boolean>;
	id: FormControl<number>;
	name: FormControl<string>;
	endpoints: FormArray<FormGroup<LocustEndpointForm>>;
}

export interface LocustEndpointForm {
	id: FormControl<number>;
	name: FormControl<string>;
	method: FormControl<string>;
	weight: FormControl<number>;
	path: FormControl<string>;
	authType: FormControl<string>;
	dataStructure: FormArray<FormGroup<TypeArrayForm>>;
	responseHandler: FormArray<FormGroup<ResponseHandlerForm>>;
}

export interface TypeArrayForm {
	name: FormControl<string>;
	type: FormControl<string>;
	data: FormArray<FormGroup<TypeForm>>;
	deletable: FormControl<boolean>;
}

export interface TypeForm {
	name: FormControl<string>;
	type: FormControl<string>;
	tag: FormControl<string>;
	valueType: FormControl<TypeFormTypes>;
	value: FormControl<string>;
	randomValueSetting: FormControl<string>;
	fakerValue: FormControl<string>;
	fakerType: FormArray<FormGroup<FakerTypeForm>>;
	length: FormControl<number>;
}

export enum TypeFormTypes {
	Null = 'Null',
	Str = 'Szöveg',
	Integer = 'Szám',
	Bool = 'Logikai típus',
	Faker = 'Faker',
	Random = 'Random'
}

export interface ResponseHandlerForm {
	equality: FormControl<string>;
	statusCode: FormControl<string>;
	log: FormControl<boolean>;
}

export interface AuthorizationForm {
	name: FormControl<string>;
	type: FormControl<AuthTypes>;
	oAuth: FormGroup<OAuthForm>;
	bearerToken: FormGroup<BearerForm>;
	apiKey: FormGroup<ApiKeyForm>;
}

export enum AuthTypes {
	OAuth = 'OAuth',
	Bearer = 'Bearer Token',
	ApiKey = 'Api key'
}

export interface OAuthForm {
	url: FormControl<string>;
	clientID: FormControl<string>;
	responseType: FormControl<string>;
	grantType: FormControl<string>;
	username: FormControl<string>;
	password: FormControl<string>;
}

export interface BearerForm {
	token: FormControl<string>;
}

export interface ApiKeyForm {
	key: FormControl<string>;
	value: FormControl<string>;
	position: FormControl<ApiKeyPosition>;
}

export interface FakerTypeForm {
	name: FormControl<string>;
	value: FormControl<string>;
}

export enum ApiKeyPosition {
	Header = 'Header',
	QueryParam = 'Query param'
}

export interface FileObjectForm {
	key: FormControl<string>;
	value: FormControl<FileObject>;
}

export interface FileObject {
	name: string;
	type: string;
	content: string;
}

export interface DictionaryForm {
	name: FormControl<string>;
	words: FormArray<FormGroup<WordForm>>;
}

export interface WordForm {
	word: FormControl<string>;
}
