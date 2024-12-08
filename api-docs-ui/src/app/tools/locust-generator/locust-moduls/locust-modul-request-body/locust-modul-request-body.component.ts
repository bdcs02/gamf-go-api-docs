/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable arrow-parens */
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Endpoint, FieldMap } from 'src/app/endpoint/api';
import { DictionaryForm, FakerTypeForm, TypeArrayForm, TypeForm, TypeFormTypes } from '../../generator-form';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/utils/dialog/confirm-dialog.component';

export interface DataStruct {
	id: number;
	type: string;
}

@Component({
	selector: 'locust-modul-request-body',
	templateUrl: './locust-modul-request-body.component.html',
	styleUrl: './locust-modul-request-body.component.scss'
})
export class LocustModulRequestBodyComponent implements OnInit {
	@Input() public endpoint!: Endpoint;
	@Input() public formArray!: FormArray<FormGroup<TypeArrayForm>>;
	@Input() public dictionaries!: FormArray<FormGroup<DictionaryForm>>;

	public dataStructures: DataStruct[] = [];
	public innerTypes: string[] = [];
	public fieldMaps: FieldMap[] = [];
	public customTypes: string[] = ['Null'];
	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly translate: TranslateService,
		private readonly dialog: MatDialog
	) {}

	public ngOnInit(): void {
		for (let i = 1; i < this.formArray.controls.length; i++) {
			this.customTypes.push(this.formArray.controls[i].controls.name.value);
		}

		if (this.endpoint.requestMapping) {
			this.endpoint.requestMapping.forEach((field) => this.structMap(field));
		}
	}

	public structMap(fieldMap: FieldMap): void {
		if (fieldMap.fields) {
			this.fieldMaps.push(fieldMap);
			this.dataStructures.push({ id: this.dataStructures.length, type: fieldMap.name });
			this.innerTypes.push(fieldMap.name);
			fieldMap.fields.forEach((field) => this.structMap(field));
		}
	}

	public dropData(event: CdkDragDrop<string[]>): void {
		if (event.previousIndex !== event.currentIndex) {
			this.formArray.markAsDirty();
		}
		moveItemInArray(this.formArray.controls, event.previousIndex, event.currentIndex);
	}

	public deleteData(id: number): void {
		this.dialog
			.open(ConfirmDialogComponent, {
				data: {
					componentName: 'LocustModulDetailsComponent',
					title: this.translate.instant('locust.modul.dataStructure.deleteTitle'),
					description: this.translate.instant('locust.modul.dataStructure.deleteMessage', {
						requestbody: this.formArray.controls[id].value.name!
					})
				}
			})
			.afterClosed()
			.subscribe((result: any) => {
				if (result) {
					this.formArray.markAsDirty();
					moveItemInArray(this.customTypes, id, this.customTypes.length - 1);
					this.customTypes.pop();
					this.formArray.removeAt(id);
				}
			});
	}

	public addData(name: string, id: number): void {
		if (name.length > 0 && this.fieldMaps[id] !== undefined) {
			this.formArray.markAsDirty();
			this.customTypes.push(name);
			this.formArray.push(
				new FormGroup<TypeArrayForm>({
					name: this.formBuilder.control(name, { nonNullable: true }),
					type: this.formBuilder.control(this.fieldMaps[id].name, { nonNullable: true }),
					data: this.formBuilder.array<FormGroup<TypeForm>>(this.createEmptyTypeArrayFormArray(this.fieldMaps[id].fields)),
					deletable: this.formBuilder.control(true, { nonNullable: true })
				})
			);
		}
	}

	private createEmptyTypeArrayFormArray(fields: FieldMap[]): FormGroup<TypeForm>[] {
		const array: FormGroup<TypeForm>[] = [];
		if (fields) {
			fields.forEach((field) => {
				array.push(
					new FormGroup<TypeForm>({
						name: this.formBuilder.control(field.name, { nonNullable: true }),
						type: this.formBuilder.control(field.kind, { nonNullable: true }),
						tag: this.formBuilder.control(field.tag, { nonNullable: true }),
						valueType: this.formBuilder.control(TypeFormTypes.Null, { nonNullable: true }),
						value: this.formBuilder.control('', { nonNullable: true }),
						randomValueSetting: this.formBuilder.control('', { nonNullable: true }),
						fakerValue: this.formBuilder.control('pystr', { nonNullable: true }),
						fakerType: this.formBuilder.array<FormGroup<FakerTypeForm>>([]),
						length: this.formBuilder.control(0, { nonNullable: true })
					})
				);
			});
		}
		return array;
	}
}
