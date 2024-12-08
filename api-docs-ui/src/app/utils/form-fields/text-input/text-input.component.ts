import { AbstractFormFieldComponent } from '../abstract-form-field.component';

import { Component, Input } from '@angular/core';

@Component({
	selector: 'text-input',
	templateUrl: 'text-input.component.html',
	styleUrls: ['../form-fields.scss']
})
export class TextInputComponent extends AbstractFormFieldComponent {
	@Input() id?: string;
	@Input() icon?: string;
	@Input() inputLimit?: number;
	@Input() readOnly?: boolean = false;
}
