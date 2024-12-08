import { Component, Input } from '@angular/core';
import { ResponseHandlerForm } from '../../generator-form';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/utils/dialog/confirm-dialog.component';

@Component({
	selector: 'locust-modul-response',
	templateUrl: './locust-modul-response.component.html',
	styleUrl: './locust-modul-response.component.scss'
})
export class LocustModulResponseComponent {
	@Input() formArray!: FormArray<FormGroup<ResponseHandlerForm>>;
	public statusCodes: string[] = [
		'200: OK',
		'201: Created',
		'202: Accepted',
		'204: No Content',
		'400: Bad Request',
		'401: Unauthorized',
		'403: Forbidden',
		'404: Not Found',
		'405: Method Not Allowed',
		'500: Internal Server Error',
		'501: Not Implemented',
		'502: Bad Gateway',
		'503: Service Unavailable'
	];

	public equality: string[] = ['Egyenlő', 'Nem egyenlő', 'Kisebb', 'Kisebb egyenlő', 'Nagyobb', 'Nagyobb egyenlő'];
	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly translate: TranslateService,
		private readonly dialog: MatDialog
	) {}

	public addResponseHandler(): void {
		this.formArray.markAsDirty();
		const response = new FormGroup<ResponseHandlerForm>({
			equality: this.formBuilder.control('', { nonNullable: true }),
			statusCode: this.formBuilder.control('', { nonNullable: true }),
			log: this.formBuilder.control(true, { nonNullable: true })
		});
		this.formArray.push(response);
	}

	public deleteResponseHandler(id: number): void {
		this.dialog
			.open(ConfirmDialogComponent, {
				data: {
					componentName: 'LocustModulResponseComponent',
					title: this.translate.instant('locust.modul.responseHandler.deleteTitle'),
					description: this.translate.instant('locust.modul.responseHandler.deleteMessage')
				}
			})
			.afterClosed()
			.subscribe((result: any) => {
				if (result) {
					this.formArray.markAsDirty();
					this.formArray.removeAt(id);
				}
			});
	}
}
