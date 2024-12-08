/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { requestSchema } from './schema';
import { RxDatabase, RxDocumentBase, createRxDatabase, addRxPlugin, RxDocumentData, RxDocument, createBlobFromBase64 } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../notification/notification.service';
import { SaveRequestComponentOptions } from '../endpoint/save-request/save-request.component';
import { ApiService } from '../endpoint/api.service';
import { RequestListItem } from '../endpoint/load-request/request';
import { globalSchema } from './global-variable-schema';
import { FormGroup } from '@angular/forms';
import { VariableForm } from '../endpoint/datasheet/endpoint-form';
import { GlobalsListItem } from './global-variables';
import { TranslateService } from '@ngx-translate/core';
import { locustSchema } from './locust-schema';
import { LocustListItem } from './locust';
import { GeneratorForm } from '../tools/locust-generator/generator-form';
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments';
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);
addRxPlugin(RxDBAttachmentsPlugin);

@Injectable({
	providedIn: 'root'
})
export class DatabaseService {
	public database!: RxDatabase;
	public endpointForm: any;
	public locustForm: any;
	public activeConfig?: string;

	constructor(
		private readonly notificationService: NotificationService,
		private readonly apiService: ApiService,
		private readonly translate: TranslateService
	) {}

	public async initDb(dbName: string): Promise<void> {
		this.database = await createRxDatabase({
			name: dbName,
			storage: getRxStorageDexie()
		});

		const col = await this.database.addCollections({
			/*
			 Add the appropriate migrationStrategies so the saved data will be modified to match the new schema
				 // 1 means, this transforms data from version 0 to version 1
				 // This will do nothing with documents and have them in the new collection version.

					migrationStrategies: {
						1: oldDoc => oldDoc
					}
			*/
			requests: {
				schema: requestSchema,
				autoMigrate: false,
				migrationStrategies: {
					1: (enableAttachments) => enableAttachments
				}
			},
			global: {
				schema: globalSchema,
				autoMigrate: false,
				migrationStrategies: {}
			},
			locust: {
				schema: locustSchema,
				autoMigrate: false,
				migrationStrategies: {}
			}
		});
		const neededRequest = await col.requests.migrationNeeded();
		const neededGlobal = await col.global.migrationNeeded();
		const neededLocust = await col.locust.migrationNeeded();

		if (neededRequest) {
			await col.requests.startMigration(10);
		}
		if (neededGlobal) {
			await col.global.startMigration(10);
		}
		if (neededLocust) {
			await col.locust.startMigration(10);
		}
	}

	public blobToBase64(blob: Blob | undefined): Promise<any> {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.readAsDataURL(blob!);
		});
	}

	public async getAttachment(name: string, key: string): Promise<Blob | undefined> {
		const docAttachment = (await this.database['requests'].find().where('name').eq(name).exec()) as RxDocumentBase<RequestListItem>[];
		return await docAttachment[0]?.getAttachment(key)?.getData();
	}

	public async insert(url: string, data: SaveRequestComponentOptions): Promise<RxDocument<any>> {
		try {
			const doc = await this.database['requests']
				.upsert({
					name: url === '' ? `${data.method}-${data.path}-${new Date().toISOString().split('T')[0]}` : url,
					config: data.config.value,
					version: environment.version,
					createDate: new Date().toISOString(),
					method: data.method
				})
				.then(async (document) => {
					for (const formData of document._data.config.requestBody.formFileData) {
						if (formData.formDataType === 'Fájl' && formData.value) {
							const content: Blob = formData.value.content as Blob;
							formData.value.content = '';
							await (document as RxDocument).putAttachment({
								id: formData.key as string,
								data: await createBlobFromBase64(formData.value.forAttachment, formData.value.type),
								type: formData.value.type
							});
							formData.value.content = content;
						}
					}
				});
			this.notificationService.create({
				translate: this.translate.instant('common.notification.saveSuccess'),
				type: 'success',
				details: this.translate.instant('common.notification.saveSuccess', { url })
			});
			return doc;
		} catch (error) {
			this.notificationService.create({ translate: 'common.notification.saveError', type: 'error' });
		}
	}

	public async insertGlobal(data: FormGroup<VariableForm>): Promise<void> {
		try {
			(await this.getGlobals()).forEach(async (global) => {
				await this.database['global'].findOne(global.key).remove();
			});

			data.getRawValue().variables.forEach(async (item: { key: any; value: any }) => {
				await this.database['global'].upsert({
					key: item.key,
					value: item.value
				});
			});
			this.notificationService.create({
				translate: this.translate.instant('common.notification.saveSuccess'),
				type: 'success',
				details: this.translate.instant('common.notification.globalVariablesSaveDetails')
			});
		} catch (error) {
			this.notificationService.create({ translate: 'common.notification.saveError', type: 'error' });
		}
	}

	public async insertLocust(data: GeneratorForm): Promise<void> {
		try {
			await this.database['locust'].upsert({
				name: 'locust',
				config: data
			});
			this.notificationService.create({
				translate: this.translate.instant('common.notification.saveSuccess'),
				type: 'success',
				details: this.translate.instant('common.notification.saveSuccess')
			});
		} catch (error) {
			this.notificationService.create({ translate: 'common.notification.saveError', type: 'error' });
		}
	}

	public async delete(data: RequestListItem): Promise<void> {
		await this.database['requests'].findOne(data.name).remove();
	}

	public async getRequests(method: string, path: string): Promise<RxDocumentData<RequestListItem>[]> {
		return (
			(await this.database['requests']
				?.find()
				.where('config.url')
				.regex(path)
				.where('method')
				.regex(method)
				.exec()) as RxDocumentBase<RequestListItem>[]
		)?.map((element) => element._data);
	}

	public async getGlobals(): Promise<RxDocumentData<GlobalsListItem>[]> {
		return ((await this.database['global']?.find().exec()) as RxDocumentBase<GlobalsListItem>[])?.map((element) => element._data);
	}

	public async getLocust(): Promise<RxDocumentData<LocustListItem>> {
		return ((await this.database['locust']?.findOne().exec()) as unknown as RxDocumentBase<LocustListItem>)?._data;
	}
}
