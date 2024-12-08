/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { ApiData } from 'src/app/endpoint/api';
import { ApiService } from 'src/app/endpoint/api.service';
import { methods } from './methods';
import { CATEGORY_BADGE_COLOR } from '../method-chip/color';
import { GlobalVariablesDialogComponent } from '../global-variables-dialog/global-variables-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { VariableForm } from '../datasheet/endpoint-form';
import { TranslateService } from '@ngx-translate/core';
import { PdfExportService } from './pdf-export.service';
import { QueryParamNavigationService } from 'src/app/query-param-navigation.service';
import { DatabaseService } from 'src/app/database/database.service';
import { RxDocumentData } from 'rxdb';
import { RequestListItem } from '../load-request/request';

@Component({
	selector: 'endpoint-list',
	templateUrl: 'endpoint-list.component.html',
	styleUrls: ['endpoint-list.component.scss']
})
export class EndpointListComponent {
	public apiData: ApiData | undefined = undefined;
	public rxDocs: RxDocumentData<RequestListItem>[] = [];
	globalVariableFormGroup!: FormGroup<VariableForm>;
	methods: string[] = methods;
	categoryBadgeColor: string = CATEGORY_BADGE_COLOR;

	constructor(
		private readonly pdf: PdfExportService,
		private readonly apiService: ApiService,
		private readonly dialog: MatDialog,
		public readonly translate: TranslateService,
		private readonly navigation: QueryParamNavigationService,
		private readonly db: DatabaseService
	) {
		apiService.getApiData().subscribe((response) => {
			this.apiData = response;
		});
		this.navigation.Navigate();
	}

	public filter(path: string, method: string): void {
		this.apiService.getApiData().subscribe((response) => {
			this.apiData = response;
			this.apiData.endpoints = this.apiData.endpoints.filter(
				(endpoint) => endpoint.path.includes(path) && (method ? endpoint.method.includes(method) : endpoint.method.includes(''))
			);
		});
	}

	public openGlobalVariables(): void {
		this.dialog.open(GlobalVariablesDialogComponent, { width: '50%' });
	}

	public exportPdf(): void {
		this.pdf.exportPdf();
	}
}
