
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { AuthGuardService } from 'src/app/auth/auth-guard.service';

@Injectable({
	providedIn: 'root'
})
export class CommonAuthGuard {
	constructor(
		protected readonly r: Router,
		protected readonly keycloak: KeycloakService,
		protected readonly authService: AuthGuardService,
	) { }

	public canActivate(): boolean {
		return true;
	}
}
