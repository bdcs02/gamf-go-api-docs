import { TextInputComponent } from '../text-input/text-input.component';

import { Component, Input } from '@angular/core';

@Component({
	selector: 'number-input',
	templateUrl: 'number-input.component.html',
	styleUrls: ['number-input.component.scss', '../form-fields.scss']
})
export class NumberInputComponent extends TextInputComponent {
	@Input() min: number | null = null;
	@Input() max: number | null = null;
}
