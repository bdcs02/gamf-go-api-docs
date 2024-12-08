/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

export type AuthorizationPlace = 'Header' | 'URL paraméter';

@Component({
	selector: 'api-key-authorization',
	templateUrl: './api-key-authorization.component.html',
	styleUrls: ['./api-key-authorization.component.scss']
})
export class ApiKeyAuthorizationComponent {
	@Input() formGroup!: FormGroup<any>;
	public authorizationPlace: AuthorizationPlace[] = ['Header', 'URL paraméter'];
}
