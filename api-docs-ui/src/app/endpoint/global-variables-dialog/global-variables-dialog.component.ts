import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { KeyValueForm, VariableForm } from '../datasheet/endpoint-form';
import { DatabaseService } from 'src/app/database/database.service';
@Component({
	selector: 'global-variables-dialog',
	templateUrl: './global-variables-dialog.component.html',
	styleUrl: './global-variables-dialog.component.scss'
})
export class GlobalVariablesDialogComponent implements OnInit {
	public formGroup!: FormGroup<VariableForm>;

	constructor(
		private readonly database: DatabaseService,
		private readonly formBuilder: FormBuilder,
	) {}

	public ngOnInit(): void {
		void this.database.getGlobals().then(item => {
			this.formGroup = this.setGlobalVariables(item.length);
			this.formGroup.controls.variables.patchValue(item);
		});
	}

	public async onSave(): Promise<void> {
		await this.database.insertGlobal(this.formGroup);
	}

	private setGlobalVariables(length: number): FormGroup<VariableForm> {
		if (length === 0) {
			return this.createGlobalVariableForm(1);
		} else {
			return this.createGlobalVariableForm(length);
		}
	}

	private createGlobalVariableForm(length: number): FormGroup<VariableForm> {
		return new FormGroup<VariableForm>({
			enabled: this.formBuilder.control(true),
			variables: this.formBuilder.array<FormGroup<KeyValueForm>>(this.createEmptyKeyValueFormArray(length))
		});
	}

	private createEmptyKeyValueFormArray(count: number): FormGroup<KeyValueForm>[] {
		const array: FormGroup<KeyValueForm>[] = [];
		for (let i = 0; i < count; i++) {
			array.push(
				new FormGroup<KeyValueForm>({
					key: new FormControl<string>('', Validators.required) as FormControl<string>,
					value: new FormControl('') as FormControl<string>
				})
			);
		}
		return array;
	}
}
