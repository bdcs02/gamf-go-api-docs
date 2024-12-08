import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
	selector: '[phoneNumber]',
	providers: [{ provide: NG_VALIDATORS, useExisting: PhoneNumberDirective, multi: true }]
})
export class PhoneNumberDirective implements Validator {
	private phoneNumberRegex = /\(?\+?[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})?/;

	public validate(element: AbstractControl): ValidationErrors | null {
		if (element.value?.length === 0) {
			return null;
		}

		return this.phoneNumberRegex.test(element.value) ? null : { phoneNumber: true };
	}
}
