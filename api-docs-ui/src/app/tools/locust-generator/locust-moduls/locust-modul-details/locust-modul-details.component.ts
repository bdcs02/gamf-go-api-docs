/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable arrow-parens */
import { AfterViewInit, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
	FakerTypeForm,
	GeneratorForm,
	LocustEndpointForm,
	ModulForm,
	ResponseHandlerForm,
	TypeArrayForm,
	TypeForm,
	TypeFormTypes
} from '../../generator-form';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Endpoint, FieldMap } from 'src/app/endpoint/api';
import { ApiService } from 'src/app/endpoint/api.service';
import { ConfirmDialogComponent } from 'src/app/utils/dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'locust-modul-details',
	templateUrl: './locust-modul-details.component.html',
	styleUrl: './locust-modul-details.component.scss'
})
export class LocustModulDetailsComponent implements AfterViewInit {
	@Input() generatorForm!: FormGroup<GeneratorForm>;
	@Input() public modulForm!: FormGroup<ModulForm>;
	public endpoints!: Endpoint[];
	public filteredEndpoints!: Endpoint[];
	public allFieldMaps: FieldMap[] = [];
	public authTypes: string[] = [];

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly apiService: ApiService,
		private readonly translate: TranslateService,
		private readonly dialog: MatDialog
	) {}

	public ngAfterViewInit(): void {
		this.apiService.getApiData().subscribe((response) => {
			this.endpoints = response.endpoints;
			this.filteredEndpoints = this.endpoints;
			this.authTypes = this.generatorForm.value.auth!.map((auth) => auth.name!);
		});
	}

	public filter(path: string): void {
		if (path !== '') {
			this.filteredEndpoints = this.endpoints.filter((endpoint) => endpoint.path.toLowerCase().includes(path.toLowerCase()));
		} else {
			this.filteredEndpoints = this.endpoints;
		}
	}

	public addEndpointToModul(path: string): void {
		if (path) {
			const endpointVar = this.endpoints.find((endpoint) => endpoint.path === path);

			this.modulForm.markAsDirty();

			const auth = this.generatorForm.value.auth![0];

			const endpointForm = new FormGroup<LocustEndpointForm>({
				id: this.formBuilder.control(
					this.endpoints.findIndex((e) => e === endpointVar),
					{ nonNullable: true }
				),
				name: this.formBuilder.control(endpointVar!.method + endpointVar!.path, { nonNullable: true }),
				method: this.formBuilder.control(endpointVar!.method, { nonNullable: true }),
				weight: this.formBuilder.control(1, { nonNullable: true }),
				path: this.formBuilder.control(endpointVar!.path, { nonNullable: true }),
				authType: this.formBuilder.control(`${auth.name}`, { nonNullable: true }),
				dataStructure: this.formBuilder.array<FormGroup<TypeArrayForm>>(this.createEmptyDataStrutureFormArray(endpointVar!.requestMapping)),
				responseHandler: this.formBuilder.array<FormGroup<ResponseHandlerForm>>([])
			});
			this.modulForm.controls.endpoints.push(endpointForm);
		}
	}

	public deleteEndpointFromModul(id: number): void {
		this.dialog
			.open(ConfirmDialogComponent, {
				data: {
					componentName: 'LocustModulDetailsComponent',
					title: this.translate.instant('locust.modul.details.deleteTitle'),
					description: this.translate.instant('locust.modul.details.deleteMessage', {
						endpoint: this.modulForm.controls.endpoints.value[id].name!
					})
				}
			})
			.afterClosed()
			.subscribe((result: any) => {
				if (result) {
					this.modulForm.markAsDirty();
					this.modulForm.controls.endpoints.removeAt(id);
				}
			});
	}

	public dropEndpoint(event: CdkDragDrop<string[]>): void {
		if (event.previousIndex !== event.currentIndex) {
			this.modulForm.markAsDirty();
		}
		moveItemInArray(this.modulForm.controls.endpoints.controls, event.previousIndex, event.currentIndex);
	}

	private createEmptyDataStrutureFormArray(dataStructures: FieldMap[]): FormGroup<TypeArrayForm>[] {
		const array: FormGroup<TypeArrayForm>[] = [];
		if (dataStructures) {
			array.push(
				new FormGroup<TypeArrayForm>({
					name: this.formBuilder.control('Request body', { nonNullable: true }),
					type: this.formBuilder.control('default', { nonNullable: true }),
					data: this.formBuilder.array<FormGroup<TypeForm>>(this.createEmptyTypeArrayFormArray(dataStructures)),
					deletable: this.formBuilder.control(false, { nonNullable: true })
				})
			);
		}
		return array;
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
						randomValueSetting: this.formBuilder.control('', { nonNullable: true }),
						value: this.formBuilder.control('', { nonNullable: true }),
						fakerValue: this.formBuilder.control('pystr', { nonNullable: true }),
						fakerType: this.formBuilder.array<FormGroup<FakerTypeForm>>([]),
						length: this.formBuilder.control(1, { nonNullable: true })
					})
				);
			});
		}
		return array;
	}
}
