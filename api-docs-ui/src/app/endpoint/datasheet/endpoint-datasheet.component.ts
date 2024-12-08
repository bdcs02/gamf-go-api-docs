/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Endpoint } from 'src/app/endpoint/api';
import { ApiService } from 'src/app/endpoint/api.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { menu, nav } from './menus';
import { NavItem } from 'src/app/navigation/nav-item';
import { MatDialog } from '@angular/material/dialog';
import { CurlGeneratorComponent } from '../curl-generator/curl-generator.component';
import {
	AuthorizationForm, EndpointForm, KeyValueForm, RequestBodyForm,
	VariableForm, FormFileData, FileObject, SettingsForm
} from './endpoint-form';
import { RequestAssembler } from './request-assembler';
import { authorizationType } from './authorization/authorization.component';
import { AuthorizationPlace } from './authorization/api-key-authorization/api-key-authorization.component';
import { SaveRequestComponent } from 'src/app/endpoint/save-request/save-request.component';
import { LoadRequestComponent } from '../load-request/load-request.component';
import { DatabaseService } from 'src/app/database/database.service';
import { saveAs } from 'file-saver';
import { CATEGORY_BADGE_COLOR } from '../method-chip/color';
import { BehaviorSubject } from 'rxjs';
import { RxDocumentData, createBlobFromBase64 } from 'rxdb';
import { RequestListItem } from '../load-request/request';
import { KeycloakService } from 'keycloak-angular';
import { DgInformationComponent } from './dg-information/dg-information.component';

type HttpResult = HttpResponse<any> | HttpErrorResponse | undefined;

@Component({
	selector: 'endpoint-datasheet',
	templateUrl: 'endpoint-datasheet.component.html',
	styleUrls: ['endpoint-datasheet.component.scss']
})
export class EndpointDatasheetComponent implements OnInit {
	@ViewChild('fileInput') fileInput!: ElementRef;
	public endpoint: Endpoint | undefined = undefined;
	public endpointForm: FormGroup<EndpointForm>;
	public response: BehaviorSubject<HttpResult> = new BehaviorSubject<HttpResult>(undefined);
	public navItemToShow: string = 'nav-details';
	public responseTime: number = 0;
	public menuArray: NavItem[] = menu;
	public navArray: NavItem[] = nav;
	public categoryBadgeColor: string = CATEGORY_BADGE_COLOR;
	public rxDocs: RxDocumentData<RequestListItem>[] = [];
	private requestAssembler: RequestAssembler;

	constructor(
		private readonly apiService: ApiService,
		private readonly router: Router,
		private readonly dialog: MatDialog,
		private readonly formBuilder: FormBuilder,
		private readonly db: DatabaseService,
		private readonly keycloak: KeycloakService,
	) {
		this.endpointForm = this.createForm(1, 1, 1, 1);
		this.requestAssembler = new RequestAssembler(apiService, this.endpointForm, db);
	}

	public async ngOnInit(): Promise<void> {
		const data = this.router.lastSuccessfulNavigation?.extras.state;
		if (data) {
			this.rxDocs = await this.db.getRequests(data['method'], data['path']);
			if (await this.keycloak.getToken()) {
				this.endpointForm.controls.authorization.patchValue({
					type: 'Keycloak',
				});
			}
			this.apiService.getEndpointData({ method: data['method'], path: data['path'] }).subscribe((response) => {
				this.endpoint = response.body!;
				this.endpointForm.controls.requestBody.controls.bodyObject.patchValue(response.body!.requestData);
				this.endpointForm.controls.requestBody.controls.bodyString.patchValue(JSON.stringify(response.body?.requestData));
				const proxyPrefix = response.headers.get('use-proxy') === 'true' ? '/api' : '';
				this.endpointForm.controls.url.patchValue(`${document.location.origin}${proxyPrefix}${this.endpoint.path}`);
				if (this.db.endpointForm) {
					this.endpointForm = this.createForm(
						this.db.endpointForm.headers.length,
						this.db.endpointForm.params.length,
						this.db.endpointForm.requestBody.formFileData.length,
						this.db.endpointForm.variables.variables.length
					);
					this.endpointForm.patchValue(this.db.endpointForm);
				}
			});
		}
	}

	public async sendRequest(): Promise<void> {
		this.requestAssembler = new RequestAssembler(this.apiService, this.endpointForm, this.db);
		const startTime = new Date().getTime();
		(await this.requestAssembler.sendRequest(this.endpoint)).subscribe({
			next: (result: HttpResponse<any> | HttpErrorResponse | undefined) => {
				this.responseTime = new Date().getTime() - startTime;
				this.response.next(result);
				this.navItemToShow = 'nav-response';
			},
			error: (error: HttpErrorResponse) => {
				this.responseTime = new Date().getTime() - startTime;
				this.response.next(error);
				this.navItemToShow = 'nav-response';
			}
		});
	}

	public selectMenuItem(id: string): void {
		switch (id) {
			case 'nav-curl':
				this.openCurlGeneratorDialog();
				break;
			case 'nav-save-request':
				this.saveRequestDialog();
				break;
			case 'nav-load-request':
				this.loadRequestDialog();
				break;
			case 'nav-export-request':
				this.exportRequest();
				break;
			case 'nav-import-request':
				this.importRequest();
				break;
		}
	}

	public selectNavItem(id: string): void {
		this.navItemToShow = id;
	}

	public openInfo(): void {
		this.dialog.open(DgInformationComponent, { maxHeight: '40rem', height: '40rem', width: '60rem', maxWidth: '60rem' });

	}
	public openFile(event: any): void {
		const input = event.target;
		const reader = new FileReader();
		reader.onload = () => {
			if (reader.result) {
				const result = JSON.parse(reader.result as string);
				this.endpointForm = this.createForm(
					result.headers.length,
					result.params.length,
					result.requestBody.formFileData.length,
					result.variables.variables.length
				);
				this.endpointForm.patchValue(JSON.parse(reader.result as string));
				this.endpointForm.controls.requestBody.controls.formFileData.value.forEach(async formData => {
					if (formData.formDataType === 'Fájl') {
						(formData.value as FileObject).content =
							await createBlobFromBase64((formData.value as FileObject).forAttachment as string, (formData.value as FileObject).type);
					}
				});
			}
		};
		reader.readAsText(input.files[0], 'utf-8');
	}

	private createForm(headerCount: number, paramCount: number, formDataCount: number, variableCount: number): FormGroup<EndpointForm> {
		return new FormGroup<EndpointForm>({

			url: new FormControl<string>('', {
				nonNullable: true
			}),
			headers: this.formBuilder.array<FormGroup<KeyValueForm>>(this.createEmptyKeyValueFormArray(headerCount)),
			params: this.formBuilder.array<FormGroup<KeyValueForm>>(this.createEmptyKeyValueFormArray(paramCount)),

			requestBody: new FormGroup<RequestBodyForm>({
				bodyString: this.formBuilder.control(''),
				bodyObject: this.formBuilder.control({}),
				type: this.formBuilder.control('Nincs'),
				formFileData: this.formBuilder.array<FormGroup<FormFileData>>(this.createFormDataFileArray(formDataCount)),
			}),

			authorization: new FormGroup<AuthorizationForm>({
				type: this.formBuilder.control<authorizationType>('Nincs', { nonNullable: true }),
				key: this.formBuilder.control('', { nonNullable: true }),
				value: this.formBuilder.control<string>('', { nonNullable: true }),
				placement: this.formBuilder.control<AuthorizationPlace>('Header', { nonNullable: true })
			}),

			variables: new FormGroup<VariableForm>({
				enabled: this.formBuilder.control(true),
				variables: this.formBuilder.array<FormGroup<KeyValueForm>>(this.createEmptyKeyValueFormArray(variableCount))
			}),

			settings: new FormGroup<SettingsForm>({
				dgSeed: this.formBuilder.control(''),
				locale: this.formBuilder.control(null)
			})
		});
	}

	private createFormDataFileArray(count: number): FormGroup<FormFileData>[] {
		const array: FormGroup<FormFileData>[] = [];
		for (let i = 0; i < count; i++) {
			array.push(
				new FormGroup<FormFileData>({
					key: new FormControl<string>('') as FormControl<string>,
					value: new FormControl<string | null | FileObject>(''),
					formDataType: new FormControl('Form Data')
				})
			);
		}
		return array;
	}

	private createEmptyKeyValueFormArray(count: number): FormGroup<KeyValueForm>[] {
		const array: FormGroup<KeyValueForm>[] = [];
		for (let i = 0; i < count; i++) {
			array.push(
				new FormGroup<KeyValueForm>({
					key: new FormControl<string>('') as FormControl<string>,
					value: new FormControl('') as FormControl<string>
				})
			);
		}
		return array;
	}

	private openCurlGeneratorDialog(): void {
		this.dialog.open(CurlGeneratorComponent, {
			width: '50%',
			data: {
				endpoint: this.endpoint,
				api: this.apiService,
				config: this.endpointForm,
				method: this.endpoint?.method
			}
		});
	}


	private saveRequestDialog(): void {
		this.dialog
			.open(SaveRequestComponent, {
				data: {
					url: this.endpointForm.controls.url.value,
					path: this.endpoint?.path,
					method: this.endpoint?.method,
					config: this.endpointForm,
				}
			})
			.afterClosed()
			.subscribe(async () => {
				const data = this.router.lastSuccessfulNavigation?.extras.state;
				if (data) {
					this.rxDocs = await this.db.getRequests(data['method'], data['path']);
				}
			});
	}

	private loadRequestDialog(): void {
		this.dialog
			.open(LoadRequestComponent, {
				width: '50%'
			})
			.afterClosed()
			.subscribe(() => {
				if (this.db.endpointForm) {
					this.endpointForm = this.createForm(
						this.db.endpointForm.headers.length,
						this.db.endpointForm.params.length,
						this.db.endpointForm.requestBody.formFileData.length,
						this.db.endpointForm.variables.variables.length
					);
					this.endpointForm.patchValue(this.db.endpointForm);
				}
			});
	}

	private exportRequest(): void {
		const res = JSON.stringify(this.endpointForm.value, null, '\t');
		const blob = new Blob([res], { type: 'application/json' });
		saveAs(blob, `${this.endpoint?.method} - ${this.endpoint?.path.replace('_', '-')} -${new Date().toISOString().split('T')[0]} ` + '.json');
	}

	private importRequest(): void {
		this.fileInput.nativeElement.click();
	}
}
