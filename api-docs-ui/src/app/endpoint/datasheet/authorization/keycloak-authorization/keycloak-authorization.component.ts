import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakConfig } from 'keycloak-js';
import { AuthGuardService } from 'src/app/auth/auth-guard.service';
import { ApiService } from 'src/app/endpoint/api.service';

@Component({
	selector: 'keycloak-authorization',
	templateUrl: './keycloak-authorization.component.html',
	styleUrl: './keycloak-authorization.component.scss'
})
export class KeycloakAuthorizationComponent {
	public keycloakConfig: KeycloakConfig | undefined;
	public isLoggedIn: boolean;

	constructor(
		private readonly keycloakService: KeycloakService,
		private readonly authGuardService: AuthGuardService,
		private readonly apiService: ApiService
	) {
		this.isLoggedIn = authGuardService.loggedIn();
		this.apiService.getApiData().subscribe(response => this.keycloakConfig = response.keycloak);
	}

	public async login(): Promise<void> {
		await this.keycloakService.login();
	}

	public async logout(): Promise<void> {
		await this.authGuardService.handleLogout();
	}
}
