import { Directive, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, Validators } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { of, skipWhile, take } from 'rxjs';

@Directive()
export abstract class AbstractFormFieldComponent implements ControlValueAccessor, OnInit {
	@Input() label = '';
	@Input() appearance: MatFormFieldAppearance = 'outline';

	public disabled = false;
	public required = false;
	public controlName: string | number | null = null;
	protected touched = false;
	private _formControl = new FormControl();

	public get formControl(): FormControl {
		return this._formControl;
	}

	public set formControl(forControl: FormControl) {
		this._formControl = forControl;
	}

	constructor(@Self() @Optional() public readonly ngControl: NgControl) {
		if (this.ngControl) {
			this.ngControl.valueAccessor = this;
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
	public onChange = (value: unknown): void => {
		/** store on change callback */
	};

	public onTouched = (): void => {
		/** to save the callback from the form */
	};

	public registerOnChange(fn: (value: unknown) => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => void): void {
		/** store on touched */
		this.onTouched = fn;
	}

	public writeValue(value: unknown): void {
		if (this.formControl.parent) {
			this.formControl.setValue(value, { emitEvent: false, emitModelToViewChange: false });
		}
	}

	public markAsTouched(): void {
		if (!this.touched) {
			this.onTouched();
			this.touched = true;
		}
	}

	public setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	public ngOnInit(): void {
		if (this.ngControl) {
			this.controlName = this.ngControl.name;
			of(this.ngControl.control)
				.pipe(
					skipWhile(fc => !fc),
					take(1)
				)
				.subscribe(fc => {
					this.formControl = fc as FormControl;
					this.required = this.formControl.hasValidator(Validators.required);
				});
		}
	}

	public refreshRequired(): void {
		this.required = this.formControl.hasValidator(Validators.required);
	}

	public onInputChange(): void {
		this.markAsTouched();
		if (!this.disabled) {
			this.onChange(this.formControl.value);
		}
	}

	public clearValue(): void {
		this.formControl.setValue(null);
	}
}
