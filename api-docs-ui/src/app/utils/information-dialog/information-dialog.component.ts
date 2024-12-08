import { InformationDialogOptions } from './information-dialog.options';

import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'information-dialog',
	templateUrl: './information-dialog.component.html',
	styleUrls: ['./information-dialog.component.scss']
})
export class InformationDialogComponent {
	public hasContent = false;

	constructor(
		public readonly dialogRef: MatDialogRef<InformationDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public readonly data: InformationDialogOptions,
		private readonly clipboard: Clipboard
	) {
		this.hasContent = data.informationMap !== undefined || data.informationList !== undefined;
	}

	public ok(): void {
		this.dialogRef.close(true);
	}

	public cancel(): void {
		this.dialogRef.close();
	}

	public copyToClipBoard(): void {
		const informationMap = this.data.informationMap;
		let copyStrings: string[] = [];

		if (informationMap) {
			informationMap.forEach((value, key) => {
				copyStrings.push(key, ...value.map(item => `\u2022 ${item}`));
			});
		} else {
			copyStrings = this.data.informationList || [];
		}

		this.clipboard.copy(copyStrings.join('\n'));
	}

	public asIsOrder(): number {
		return 1;
	}
}
