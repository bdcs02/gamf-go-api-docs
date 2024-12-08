/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'file-request-body',
	templateUrl: './file-request-body.component.html',
	styleUrl: './file-request-body.component.scss'
})
export class FileRequestBodyComponent {
	@Input() formGroup!: FormGroup<any>;
	public fileName: string = '';

	public onFileSelected(event: Event): void {
		if (event && event.target) {
			this.fileName = (event.target as HTMLInputElement).files![0].name;
			this.formGroup.patchValue({ file: (event.target as HTMLInputElement).files![0] });
		}
	}
}
