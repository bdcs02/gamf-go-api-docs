/* eslint-disable arrow-parens */
import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FileObject, FileObjectForm } from '../generator-form';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'locust-files',
	templateUrl: './locust-files.component.html',
	styleUrl: './locust-files.component.scss'
})
export class LocustFilesComponent {
	@Input() formArray!: FormArray<FormGroup<FileObjectForm>>;

	constructor(private readonly translate: TranslateService) {}

	public addRow(): void {
		this.formArray.markAsDirty();
		const keyPairForm = new FormGroup<FileObjectForm>({
			key: new FormControl<string>('') as FormControl<string>,
			value: new FormControl<FileObject>({ name: '', type: '', content: '' }) as FormControl<FileObject>
		});
		this.formArray?.push(keyPairForm);
	}

	public deleteRow(rowId: number): void {
		this.formArray.markAsDirty();
		this.formArray?.removeAt(rowId);
	}

	public blobToBase64(blob: Blob): Promise<any> {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.readAsDataURL(blob);
		});
	}

	public openFileDialog(i: number): void {
		const fileInput = document.getElementById(`selectedFile-${i}`) as HTMLInputElement;
		fileInput?.click();
	}

	public async onFileSelected(event: Event, i: number): Promise<void> {
		if (event && event.target) {
			const inputFile = (event.target as HTMLInputElement).files![0];
			this.formArray.controls[i].patchValue({
				value: {
					content: await this.blobToBase64(new Blob([inputFile], { type: inputFile.type })).then((item) => (item as string).split(',')[1]),
					name: inputFile.name,
					type: inputFile.type
				}
			});
		}
	}

	public getFilename(i: number): string {
		if (this.formArray.controls[i].controls.value.value) {
			return this.formArray.controls[i].controls.value.value.name;
		}
		return this.translate.instant('common.file');
	}
}
