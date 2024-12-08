import { DatasheetBaseComponent } from '../datasheet-base.component';

import { Component, Input } from '@angular/core';

@Component({
	selector: 'datasheet-link',
	templateUrl: 'datasheet-link.component.html',
	styleUrls: ['../datasheet-base.scss']
})
export class DataSheetLinkComponent extends DatasheetBaseComponent {
	@Input() link = '';
	@Input() disabled = false;

	protected override copyValue(): void {
		this.clipboard.copy(String(`${document.location.origin}${this.link}`));
	}
}
