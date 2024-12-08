/* eslint-disable arrow-parens */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuardService extends KeycloakAuthGuard {
	public name = new BehaviorSubject<string>('');

	constructor(
		protected override readonly router: Router,
		private readonly keycloakService: KeycloakService
	) {
		super(router, keycloakService);
	}

	public async handleLogout(): Promise<void> {
		await this.keycloakService.logout(window.location.origin);
		this.name.next('');
		localStorage.removeItem('username');
		localStorage.removeItem('webdavUserId');
		localStorage.removeItem('webdavToken');
	}

	public loggedIn(): boolean {
		return this.keycloakService.isLoggedIn();
	}

	public currentUser(): string {
		return localStorage.getItem('displayname') ?? '';
	}

	public async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		// Force the user to log in if currently unauthenticated.
		if (!this.authenticated) {
			await this.keycloakService.login({
				redirectUri: window.location.origin + state.url
			});
		}
		// Get the roles required from the route.
		const requiredRoles = route.data.roles;

		// Allow the user to proceed if no additional roles are required to access the route.
		if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
			return true;
		}

		// Allow the user to proceed if all the required roles are present.
		return requiredRoles.every((role) => this.roles.includes(role));
	}

	public hasUserGroup(groupName: string): boolean {
		const token: Keycloak.KeycloakTokenParsed | undefined = this.keycloakService.getKeycloakInstance().tokenParsed;
		if (token) {
			const groups = token['adGroupNames'] as string[];
			if (groups) {
				if (groups.indexOf(groupName) > -1) {
					return true;
				}
			}
		}

		return false;
	}

	public getUsername(): string {
		const token: Keycloak.KeycloakTokenParsed | undefined = this.keycloakService.getKeycloakInstance().tokenParsed;

		if (token) {
			return token['family_name'] + ' ' + token['given_name'];
		}

		return '';
	}
}
