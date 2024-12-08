/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { requestBodyType } from './request-editor/request-editor.component';
import { authorizationType } from './authorization/authorization.component';
import { AuthorizationPlace } from './authorization/api-key-authorization/api-key-authorization.component';
import { CurlBody } from 'curl-generator/dist/bodies/body';
import { StringMap } from 'quill';

export interface EndpointForm {
	url: FormControl<string>;
	requestBody: FormGroup<RequestBodyForm>;
	headers: FormArray<FormGroup<KeyValueForm>>;
	params: FormArray<FormGroup<KeyValueForm>>;
	authorization: FormGroup<AuthorizationForm>;
	variables: FormGroup<VariableForm>;
	settings: FormGroup<SettingsForm>;
}

export interface AuthorizationForm {
	type: FormControl<authorizationType>;
	key: FormControl<string>;
	value: FormControl<string>;
	placement: FormControl<AuthorizationPlace>;
}

export interface RequestBodyForm {
	type: FormControl<requestBodyType | null>;
	bodyObject: FormControl<any>;
	bodyString: FormControl<string | null>;
	formFileData: FormArray<FormGroup<FormFileData>>;
}

export interface SettingsForm {
	dgSeed: FormControl<string | null>;
	locale: FormControl<string | null>;
}

export interface FormFileData {
	formDataType: FormControl<string | null>;
	key: FormControl<string>;
	value: FormControl<string | null | FileObject>;
}

export interface VariableForm {
	enabled: FormControl<boolean | null>;
	variables: FormArray<FormGroup<KeyValueForm>>;
}

export interface KeyValueForm {
	key: FormControl<string>;
	value: FormControl<string>;
}

export interface KeyValue {
	key: string;
	value: string;
}

export interface CurlRequest {
	method?: 'GET' | 'get' | 'POST' | 'post' | 'PUT' | 'put' | 'PATCH' | 'patch' | 'DELETE' | 'delete';
	headers?: StringMap;
	body?: CurlBody;
	url: string;
}

export interface FileObject {
	baseFormat?: boolean;
	lastModified: number;
	name: string;
	size: number;
	type: string;
	forAttachment?: string | File | Blob;
	content: Blob | string;
}
