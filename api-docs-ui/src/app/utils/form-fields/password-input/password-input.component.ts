import { TextInputComponent } from '../text-input/text-input.component';

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'password-input',
	templateUrl: 'password-input.component.html',
	styleUrls: ['password-input.component.scss', '../form-fields.scss']
})
export class PasswordInputComponent extends TextInputComponent {
	@Input() visibilityButton = true;
	@Input() longErrorMessage = false;
	@Output() focused: EventEmitter<boolean> = new EventEmitter<boolean>();

	public hidePassword = true;
}
