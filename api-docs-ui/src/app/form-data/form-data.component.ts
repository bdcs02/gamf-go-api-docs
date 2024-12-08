import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { FileObject, RequestBodyForm } from '../endpoint/datasheet/endpoint-form';
import { TranslateService } from '@ngx-translate/core';

export type formDataType = 'Fájl' | 'Form Data';

@Component({
	selector: 'form-data',
	templateUrl: './form-data.component.html',
	styleUrl: './form-data.component.scss'
})
export class FormDataComponent implements OnInit {
	@Input() formGroup!: FormGroup<RequestBodyForm>;
	@Input() formArrayName: string = '';
	@Input() editorType!: string;
	public keyvaluePairs: FormArray | undefined;
	public formDataTypes: formDataType[] = ['Fájl', 'Form Data'];

	constructor(private readonly formBuilder: FormBuilder, private readonly translate: TranslateService) { }

	public ngOnInit(): void {
		this.keyvaluePairs = (this.formGroup.get(this.formArrayName) as FormArray);
	}

	public getFilename(i: number): string {
		if (this.formGroup.controls.formFileData.value[i].value) {
			return (this.formGroup.controls.formFileData.value[i].value as FileObject).name;
		}
		return this.translate.instant('common.file');
	}

	public addRow(): void {
		const keyPairForm = this.formBuilder.group({
			key: new FormControl<string>('') as FormControl<string>,
			value: new FormControl<string>('') as FormControl<string>,
			formDataType: new FormControl('Form Data')
		});
		this.keyvaluePairs?.push(keyPairForm);
	}

	public deleteRow(rowId: number): void {
		this.keyvaluePairs?.removeAt(rowId);
	}


	public base64ToBlob(base64: string, contentType = '', sliceSize = 512): Blob {
		const byteCharacters = atob(base64.split(',')[1]);
		const byteArrays = [];

		for (let offset = 0; offset < byteCharacters.length;
			offset += sliceSize) {
			const slice = byteCharacters.slice(
				offset, offset + sliceSize);

			const byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			const byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}

		const blob = new Blob(byteArrays, { type: contentType });
		return blob;
	}

	public blobToBase64(blob: Blob): Promise<any> {
		return new Promise(resolve => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.readAsDataURL(blob);
		});
	}

	public isBase64(i: number): boolean {
		return (this.formGroup.controls.formFileData.value[i].value as FileObject).baseFormat as boolean;
	}

	public openFileDialog(i: number): void {
		const fileInput = document.getElementById(`selectedFile-${i}`) as HTMLInputElement;
		fileInput?.click();
	}

	public async typeConversion(checked: boolean, i: number): Promise<void> {
		const fileObject = this.formGroup.controls.formFileData.value[i].value as FileObject;

		if (fileObject.content) {
			if (checked) {
				fileObject.content = await this.blobToBase64(new Blob([fileObject.content], { type: fileObject.type }))
					.then(item => item as string);
				fileObject.baseFormat = true;
			} else {
				fileObject.baseFormat = false;
				fileObject.content = this.base64ToBlob(fileObject.content as string, fileObject.type);
			}
		}

	}

	public async onFileSelected(event: Event, i: number): Promise<void> {
		if (event && event.target) {
			const inputFile = (event.target as HTMLInputElement).files![0];
			this.formGroup.controls.formFileData.controls[i].patchValue({
				value: {
					forAttachment: await this.blobToBase64(new Blob([inputFile],
						{ type: inputFile.type })).then(item => (item as string).split(',')[1]),
					content: new Blob([inputFile], { type: inputFile.type }),
					baseFormat: false,
					name: inputFile.name,
					lastModified: inputFile.lastModified,
					size: inputFile.size,
					type: inputFile.type,
				}
			});
		}
	}
}
