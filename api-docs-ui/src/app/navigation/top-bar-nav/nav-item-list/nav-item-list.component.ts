import { KeycloakService } from 'keycloak-angular';
import { AuthGuardService } from 'src/app/auth/auth-guard.service';

import { Component, Input } from '@angular/core';

import { NavItem } from '../../nav-item';
import { Router } from '@angular/router';
import { QueryParamNavigationService } from 'src/app/query-param-navigation.service';

@Component({
	selector: 'nav-item-list',
	templateUrl: './nav-item-list.component.html',
	styleUrls: ['./nav-item-list.component.scss']
})
export class NavItemListComponent {
	@Input() items?: NavItem[] = [];

	constructor(
		protected readonly authService: AuthGuardService,
		private readonly keycloakService: KeycloakService,
		private readonly router: Router,
		private readonly navigationService: QueryParamNavigationService
	) {}

	public async handleClick(item: NavItem): Promise<void> {
		if (item.operation) {
			switch (item.operation) {
				case 'keycloak-login': {
					await this.keycloakService.login({
						redirectUri: window.location.origin + '/api/apidoc/ui/'
					});
					break;
				}
				default:
					break;
			}
		}
	}

	public async navigate(route: string | undefined | null): Promise<void> {
		if (route !== undefined) {
			await this.router.navigate(['.'], { queryParams: { path: route } });
			this.navigationService.Navigate();
		}
	}
}
