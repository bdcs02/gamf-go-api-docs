import { KeycloakConfig } from 'keycloak-js';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiData {
	appname: string;
	endpoints: Endpoint[];
	keycloak: KeycloakConfig | undefined;
}

export interface FieldMap {
	name: string;
	description: string;
	type: string;
	tag: string;
	validation: string;
	kind: string;
	key: FieldMap;
	fields: FieldMap[];
}

export interface Endpoint {
	path: string;
	method: string;
	category: string;
	permission: string;
	description: string;
	requestData: any;
	responseMapping: FieldMap[];
	responseType: FieldMap;
	requestMapping: FieldMap[];
	requestType: FieldMap;
	responseData: any;
	contentType: ContentTypes;
}

export interface EndpointDataRequest {
	path: string | null;
	method: string | null;
}

export enum ContentTypes {
	JSON = 'application/json',
	XML = 'application/xml',
	BYTE = 'application/octet-stream',
	TEXT = 'text/plain',
	IMAGE = 'image/',
	NULL = '',
	FORM_DATA = 'multipart/form-data'
}
