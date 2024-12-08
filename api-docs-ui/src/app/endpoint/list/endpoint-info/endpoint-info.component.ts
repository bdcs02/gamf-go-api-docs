/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentTypes, Endpoint } from 'src/app/endpoint/api';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { QueryParamNavigationService } from 'src/app/query-param-navigation.service';

@Component({
	selector: 'endpoint-info',
	templateUrl: 'endpoint-info.component.html',
	styleUrls: ['endpoint-info.component.scss']
})
export class EndpointInfoComponent{
	@Input() public endpoint: Endpoint | undefined = undefined;
	@Input() public displayDetailsButton: boolean = true;

	constructor(private readonly router: Router, private readonly navigation: QueryParamNavigationService) {
	}

	public async openEndpoint(endpoint: Endpoint): Promise<void> {
		await this.router.navigate(['.'], { queryParams: {path: 'endpoint', endpointMethod: endpoint.method, endpointPath: endpoint.path} });
		this.navigation.Navigate();
	}

	public get contentTypes(): typeof ContentTypes {
		return ContentTypes;
	}
}
