import { DatasheetBaseComponent } from '../datasheet-base.component';

import { Component, Input } from '@angular/core';

export interface DatasheetChip {
	id: string;
	label: string;
	click: (id: string) => void;
}

@Component({
	selector: 'datasheet-chips',
	templateUrl: 'datasheet-chips.component.html',
	styleUrls: ['../datasheet-base.scss', './datasheet-chips.component.scss']
})
export class DataSheetChipsComponent extends DatasheetBaseComponent {
	@Input() values: DatasheetChip[] | undefined = [];

	protected override copyValue(): void {
		if (this.values) {
			this.clipboard.copy(this.values.map(v => v.label).join('; '));
		}
	}
}
