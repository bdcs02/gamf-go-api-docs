import { FormGroup } from '@angular/forms';
import { EndpointForm, CurlRequest, FileObject } from './endpoint-form';
import { Endpoint } from '../api';
import { StringMap } from 'quill';
import { RequestAssembler } from './request-assembler';
import { ApiService } from '../api.service';
import { CurlBody } from 'curl-generator/dist/bodies/body';
import { TranslateService } from '@ngx-translate/core';
import { inject } from '@angular/core';
import { DatabaseService } from 'src/app/database/database.service';
import { CurlFileBody } from 'curl-generator/dist/bodies/file-body';
import { CurlFormBody } from 'curl-generator/dist/bodies/form-body';

export class CurlAssembler extends RequestAssembler {
	private curlHeader: StringMap = {};
	private readonly translate: TranslateService;

	constructor(
		private readonly formGroupCurl: FormGroup<EndpointForm>,
		private readonly apiServiceCurl: ApiService,
		private readonly db: DatabaseService,
	) {
		super(apiServiceCurl, formGroupCurl, db,);
		this.translate = inject(TranslateService);
	}

	public async genCurl(endpoint: Endpoint | undefined): Promise<CurlRequest> {
		this.clearData();
		if (endpoint) {
			await this.assembleAuthorizationData();
			await this.getHeaders();
			await this.getParams();
			return {
				url: await this.assembleUrl(this.formGroupCurl.controls.url.value) as string,
				body: await this.assembleCurlBody(),
				headers: this.curlHeader,
				method: endpoint.method as 'delete' | 'GET' | 'POST' | 'post' | 'PUT' | 'put' | 'PATCH' | 'patch' | 'DELETE' | undefined
			};
		}
		return { url: '' };
	}
	public async assembleCurlBody(): Promise<CurlBody> {
		const body = this.formGroupCurl.getRawValue().requestBody;
		switch (body.type) {
			case this.translate.instant('requestBodyType.noType'): {
				break;
			}
			case this.translate.instant('requestBodyType.formData'): {
				const content: Record<string, CurlFileBody> = {};
				for (const item of body.formFileData) {
					item.key = await this.applyVariables(item.key) as string;
					if (item.formDataType === 'Fájl') {
						content[item.key] = {
							fileName: (item.value as FileObject).name,
							type: 'file'
						};
					}
					else {
						item.value = await this.applyVariables(item.value as string);
					}
				}
				return ({
					type: 'form',
					content,
				}) as CurlFormBody;
			}
			case this.translate.instant('requestBodyType.json'): {
				this.headers = this.headers.append('Content-Type', 'application/json');
				const bodyString = JSON.stringify(body.bodyString);
				return await this.applyVariables(bodyString) as string;
			}
			case this.translate.instant('requestBodyType.text'): {
				this.headers = this.headers.append('Content-Type', 'text/plain');
				return await this.applyVariables(body.bodyString) as string;
			}
		}
		return '';
	}

	public override async getHeaders(): Promise<void> {
		await super.getHeaders();
		if (this.formGroupCurl.controls.authorization.value.type === 'Keycloak') {
			this.headers = this.headers.append('Authorization', 'Bearer ');
		}
		this.headers.keys().forEach(async key => {
			key = await this.applyVariables(key) as string;
			this.curlHeader[key] = this.headers.get(key);
		});
	}


	public async assembleUrl(url: string): Promise<string | null> {
		url = await this.applyVariables(url) as string;
		if (this.httpParams.keys().length !== 0) {
			let result = '?';
			this.httpParams.keys().forEach(key => {
				result += `${key}=${this.httpParams.get(key)}&`;
			});
			result = `"${await this.applyVariables(url)}${result.slice(0, -1)}"`;
			return result;
		}
		return `"${url}"`;
	}
}
