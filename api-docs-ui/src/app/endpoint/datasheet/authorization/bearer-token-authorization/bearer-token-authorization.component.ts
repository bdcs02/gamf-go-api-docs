/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'bearer-token-authorization',
	templateUrl: './bearer-token-authorization.component.html',
})
export class BearerTokenAuthorizationComponent {
	@Input() formGroup!: FormGroup<any>;
}
