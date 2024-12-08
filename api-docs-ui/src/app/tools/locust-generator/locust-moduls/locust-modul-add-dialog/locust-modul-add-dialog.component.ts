import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

export interface ModulNameForm {
	name: FormControl<string>;
}

@Component({
	selector: 'app-locust-modul-add-dialog',
	templateUrl: './locust-modul-add-dialog.component.html',
	styleUrl: './locust-modul-add-dialog.component.scss'
})
export class LocustModulAddDialogComponent {
	public form: FormGroup<ModulNameForm>;

	constructor(public readonly dialogRef: MatDialogRef<LocustModulAddDialogComponent>) {
		this.form = new FormGroup<ModulNameForm>({
			name: new FormControl<string>('', {
				nonNullable: true
			})
		});
	}

	public closeDialog(): void {
		this.dialogRef.close();
	}

	public saveDialog(): void {
		if (this.form.valid) {
			const values = this.form.getRawValue();
			this.dialogRef.close(values.name);
		}
	}
}
