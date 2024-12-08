import { TextInputComponent } from '../text-input/text-input.component';

import { Component } from '@angular/core';

@Component({
	selector: 'textarea-input',
	templateUrl: 'textarea-input.component.html',
	styleUrls: ['textarea-input.component.scss', '../form-fields.scss']
})
export class TextareaInputComponent extends TextInputComponent {}
