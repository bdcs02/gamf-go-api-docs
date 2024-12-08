/* eslint-disable @typescript-eslint/no-explicit-any */
import { KeycloakService } from 'keycloak-angular';
import { catchError, first, Observable, of } from 'rxjs';

import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiPath } from '../http/api-path';
import { ApiData, Endpoint, EndpointDataRequest } from './api';
import { Router } from '@angular/router';
import { ResponseType } from './datasheet/request-assembler';
import { DatabaseService } from '../database/database.service';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private apiData: ApiData | undefined = undefined;
	constructor(public readonly router: Router, private readonly httpClient: HttpClient, private readonly keycloak: KeycloakService) { }

	public getApiData(): Observable<ApiData> {
		return this.httpClient.get<ApiData>(`${ApiPath.data}`);
	}

	public getEndpointData(request: EndpointDataRequest): Observable<HttpResponse<Endpoint>> {
		return this.httpClient.post<Endpoint>(`${ApiPath.endpoint}`, request, { observe: 'response' }).pipe(first());
	}

	public sendRequest(
		path: string,
		method: string,
		body: any,
		headers: HttpHeaders,
		params: HttpParams,
		responseType: ResponseType
	): Observable<HttpResponse<any>> {
		return this.httpClient.request(
			method,
			path,
			{ body, observe: 'response', responseType, headers, params }
		).pipe(first()) as Observable<HttpResponse<any>>;
	}

	public setApiData(apiData: ApiData): void {
		this.apiData = apiData;
	}
}

export function initApp(keycloak: KeycloakService, apiService: ApiService, databaseService: DatabaseService): () => Promise<void> {
	return () => new Promise<void>(resolve => {
		apiService.getApiData().pipe(
			catchError(() => of(null))
		).subscribe(async response => {
			if (response != null) {
				apiService.setApiData(response);
				if (response.keycloak) {
					await keycloak.init({
						config: response.keycloak,
						initOptions: {
							onLoad: 'check-sso',
							silentCheckSsoRedirectUri: window.location.origin + '/api/apidoc/ui/assets/silent-check-sso.html',
						}
					})

					if (response.appname === '') {
						response.appname = 'default-db';
					}

					await databaseService.initDb(response.appname);

					resolve();
				}
			}
			else {
				await apiService.router.navigateByUrl('/keycloak-error', { skipLocationChange: true });
				resolve();
			}
		});
	});
}
