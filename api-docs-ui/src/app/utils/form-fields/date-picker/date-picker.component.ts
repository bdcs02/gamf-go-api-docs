import { AbstractFormFieldComponent } from '../abstract-form-field.component';

import { Component, Input } from '@angular/core';

@Component({
	selector: 'date-picker',
	templateUrl: 'date-picker.component.html',
	styleUrls: ['date-picker.component.scss', '../form-fields.scss']
})
export class DatePickerComponent extends AbstractFormFieldComponent {
	@Input() min: Date | undefined;
	@Input() max: Date | undefined;
}
