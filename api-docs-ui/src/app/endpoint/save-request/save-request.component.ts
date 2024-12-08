import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { DatabaseService } from '../../database/database.service';
import { EndpointForm } from 'src/app/endpoint/datasheet/endpoint-form';
import { RequestListItem } from '../load-request/request';
import { RxDocumentData } from 'rxdb';

export interface SaveRequestComponentOptions {
	path: string;
	method: string;
	config: FormGroup<EndpointForm>;
}

interface AddRequestForm {
	url: FormControl<string>;
}

@Component({
	selector: 'save-request',
	templateUrl: './save-request.component.html',
	styleUrl: './save-request.component.scss'
})
export class SaveRequestComponent implements OnInit {
	public form: FormGroup<AddRequestForm>;
	private lastSavedName: RxDocumentData<RequestListItem>[] = [];

	constructor(@Inject(MAT_DIALOG_DATA) public readonly data: SaveRequestComponentOptions, private readonly db: DatabaseService) {
		this.form = this.createForm();
	}
	public async ngOnInit(): Promise<void> {
		if (this.db.activeConfig) {
			this.form.controls.url.setValue(this.db.activeConfig);
		}
		else {
			await this.db.getRequests(this.data.method, this.data.path).then(
				item => {
					if (item) {
						this.lastSavedName = item;
						this.form.controls.url
							.setValue
							(this.lastSavedName[this.lastSavedName.length - 1] ? this.lastSavedName[this.lastSavedName.length - 1].name : '');
					}
				}
			);
		}
	}

	public async onSave(): Promise<void> {
		await this.db.insert(this.form.getRawValue().url, this.data);
	}

	private createForm(): FormGroup<AddRequestForm> {
		return new FormGroup<AddRequestForm>({
			url: new FormControl<string>('', {
				nonNullable: true,
			}),
		});
	}

}
