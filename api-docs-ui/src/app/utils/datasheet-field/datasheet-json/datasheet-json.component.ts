import { DatasheetBaseComponent } from '../datasheet-base.component';

import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'datasheet-json',
	templateUrl: 'datasheet-json.component.html',
	styleUrls: ['../datasheet-base.scss', 'datasheet-json.component.scss']
})
export class DatasheetJsonComponent extends DatasheetBaseComponent implements OnInit {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public jsonData: any = null;

	constructor(private readonly clip: Clipboard, private readonly translate: TranslateService) {
		super(clip);
	}

	public ngOnInit(): void {
		if (this.value) {
			try {
				this.jsonData = JSON.parse(String(this.value));
				this.unpackJsonString(this.jsonData);
			} catch {
				this.jsonData = {
					[this.translate.instant('common.datasheet.error')]: this.translate.instant('common.datasheet.jsonInvalidDesciprion'),
					[this.translate.instant('common.datasheet.value')]: this.value
				};
			}
		}
	}

	protected override copyValue(): void {
		this.clipboard.copy(JSON.stringify(this.jsonData, null, 2));
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private unpackJsonString(json: any): void {
		if (json && Object.keys(json).length > 0) {
			for (const [key, value] of Object.entries(json)) {
				if (typeof value === 'string' && /^[\],:{}\s]*$/.test(value)) {
					try {
						json[key] = JSON.parse(value);
					} catch {
						/* */
					}
				} else if (typeof json[key] === 'object') {
					this.unpackJsonString(json[key]);
				}
			}
		}
	}
}
