import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class QueryParamNavigationService {

	constructor( private readonly route: ActivatedRoute,private readonly router: Router) { }

	public Navigate(): void
	{
		this.route.queryParams.subscribe(async params => {
			if(params['path']) {
				await this.router.navigate(
					['/'+params['path']],
					{
						skipLocationChange:true,
						state: {
							method: params['endpointMethod'],
							path: params['endpointPath']
						}
					});
			}
		});
	}
}
