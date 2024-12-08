/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import { FormGroup } from '@angular/forms';
import { EndpointForm, RequestBodyForm } from '../endpoint/datasheet/endpoint-form';

@Component({
	selector: 'key-value-editor',
	templateUrl: './key-value-editor.component.html',
	styleUrl: './key-value-editor.component.scss'
})
export class KeyValueEditorComponent {
	@Input() formGroup!: FormGroup<any>;
	@Input() formArrayName: keyof EndpointForm | keyof RequestBodyForm = 'headers';
	@Input() keyIsCopiable: boolean = false;
	@Input() editorType!: string;
	@Input() formControllName = '';

	constructor(private readonly formBuilder: FormBuilder, private readonly clipboard: Clipboard) {}

	public addRow(): void {
		const keyPairForm = this.formBuilder.group({
			key: [''],
			value: ['']
		});
		this.keyValuePairs()?.push(keyPairForm);
	}

	public deleteRow(rowId: number): void {
		this.keyValuePairs()?.removeAt(rowId);
	}

	public copyKey(text: string): void {
		this.clipboard.copy(text);
	}

	public keyValuePairs(): FormArray | undefined {
		if (this.formGroup) {
			return this.formGroup.get(this.formArrayName) as FormArray;
		} else {
			return undefined;
		}
	}
}
