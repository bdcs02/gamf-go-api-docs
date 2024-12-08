import { ControlValueAccessor } from '@angular/forms';
import { Directive } from '@angular/core';
import { ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { HostListener } from '@angular/core';

@Directive({
	selector: 'input[type=file][formControlName]',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: FileUploadAccessorDirective,
			multi: true
		}
	]
})

export class FileUploadAccessorDirective implements ControlValueAccessor {
	private onChange!: (file: File | null) => void;

	constructor(private readonly host: ElementRef<HTMLInputElement>) { }

	@HostListener('change', ['$event.target.files'])
	public emitFiles(event: FileList): void {
		const file = event && event.item(0);
		this.onChange(file);
	}

	public writeValue(): void {
		this.host.nativeElement.value = '';
	}

	public registerOnChange(fn: () => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(): void { }
}
