/* eslint-disable arrow-parens */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/database/database.service';
import { RequestListItem } from './request';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RxDocumentData } from 'rxdb';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/utils/dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/notification/notification.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { QueryParamNavigationService } from 'src/app/query-param-navigation.service';
import { Router } from '@angular/router';
import { SimpleTableConfig } from 'src/app/utils/simple-table/simple-table-config';
import { loadRequestTableConfig } from './load-request-simple-config';

@Component({
	selector: 'load-request',
	templateUrl: './load-request.component.html',
	styleUrl: './load-request.component.scss'
})
export class LoadRequestComponent implements OnInit {
	@Input() public method: string | undefined;
	@Input() public path: string | undefined;
	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	public displayedColumns: string[] = ['name', 'version', 'createDate', 'actions'];
	public dataSource!: MatTableDataSource<RxDocumentData<RequestListItem>>;
	public version = environment.version;
	public config: SimpleTableConfig<RequestListItem>;

	constructor(
		private readonly db: DatabaseService,
		private readonly dialog: MatDialog,
		private readonly translate: TranslateService,
		private readonly notificationService: NotificationService,
		private readonly router: Router,
		private readonly navigation: QueryParamNavigationService
	) {
		this.config = loadRequestTableConfig(this.deleteRequest.bind(this), this.loadRequest.bind(this), this.exportRequest.bind(this));
	}

	public async ngOnInit(): Promise<void> {
		await this.getRequestsFromDb();
	}

	public async loadRequest(row: RequestListItem): Promise<void> {
		this.db.endpointForm = row.config;
		for (const form of this.db.endpointForm.requestBody.formFileData) {
			if (form.formDataType === 'Fájl') {
				form.value.content = await this.db.getAttachment(row.name, form.key as string);
			}
		}
		this.db.activeConfig = row.name;
		if (this.method && this.path) {
			void this.router.navigate(['.'], { queryParams: { path: 'endpoint', endpointMethod: this.method, endpointPath: this.path } });
			this.navigation.Navigate();
		}
	}

	public exportRequest(row: RequestListItem): void {
		const res = JSON.stringify(row.config.value, null, '\t');
		const blob = new Blob([res], { type: 'application/json' });
		saveAs(blob, row.name + '.json');
	}

	public deleteRequest(row: RequestListItem): void {
		this.dialog
			.open(ConfirmDialogComponent, {
				data: {
					componentName: 'LoadRequestComponent',
					title: this.translate.instant('data.request.deleteRequestTitle'),
					description: this.translate.instant('data.request.deleteRequestContent', { request: row.name })
				}
			})
			.afterClosed()
			.subscribe(async (result) => {
				if (result) {
					try {
						await this.db.delete(row).then(async () => {
							this.notificationService.create({ translate: 'common.notification.deleteSuccess', type: 'success' });
							await this.getRequestsFromDb();
						});
					} catch (error) {
						this.notificationService.create({ translate: 'common.notification.deleteError', type: 'error' });
					}
				}
			});
	}
	private async getRequestsFromDb(): Promise<void> {
		const data = this.router.lastSuccessfulNavigation?.extras.state;
		if (data) {
			if (data['method']) {
				this.method = data['method'];
			}
			if (data['path']) {
				this.path = data['path'];
			}
		}
		this.dataSource = new MatTableDataSource(await this.db.getRequests(this.method!, this.path!));
	}
}
