import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
	public static phone(control: AbstractControl): ValidationErrors | null {
		if (!control.value || control.value?.length === 0) {
			return null;
		}

		const regex = /\(?\+?[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})?/;

		return regex.test(control.value) ? null : { phoneNumber: true };
	}

	public static hungarianMobilePhoneNumber(control: AbstractControl): ValidationErrors | null {
		if (!control.value || control.value.length === 0) {
			return null;
		}

		const regex = /^36[0-9]{9}$/;

		return regex.test(control.value) ? null : { hungarianMobilePhoneNumber: true };
	}

	public static email(control: AbstractControl): ValidationErrors | null {
		if (!control.value || control.value?.length === 0) {
			return null;
		}

		const regex =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

		return regex.test(control.value) ? null : { invalidEmail: true };
	}

	public static noWhitespaceOnly(control: AbstractControl): ValidationErrors | null {
		if (control.value) {
			return String(control.value).trim().length === 0 ? { noWhitespaceOnly: true } : null;
		}

		return null;
	}

	public static matchValues(matchTo: string): (_1: AbstractControl) => ValidationErrors | null {
		return (control: AbstractControl): ValidationErrors | null =>
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			 !!control.parent && !!control.parent.value && control.value === (control.parent.controls as any)[matchTo].value
				? null
				: { doesNotMatch: true };
	}
}
