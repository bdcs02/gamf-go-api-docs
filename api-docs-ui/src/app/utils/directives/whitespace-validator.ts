import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
	selector: '[noWhitespace]',
	providers: [{ provide: NG_VALIDATORS, useExisting: WhitespaceValidator, multi: true }]
})
export class WhitespaceValidator implements Validator {
	public validate(element: AbstractControl): ValidationErrors | null {
		if (element.value) {
			return String(element.value).trim().length === 0 ? { noWhitespaceOnly: true } : null;
		}

		return null;
	}
}
