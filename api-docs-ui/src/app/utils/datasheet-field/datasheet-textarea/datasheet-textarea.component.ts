import { DatasheetBaseComponent } from '../datasheet-base.component';

import { Component, Input } from '@angular/core';

@Component({
	selector: 'datasheet-textarea',
	templateUrl: 'datasheet-textarea.component.html',
	styleUrls: ['../datasheet-base.scss', './datasheet-textarea.component.scss']
})
export class DataSheetTextAreaComponent extends DatasheetBaseComponent {
	@Input() enableTooltip = false;
}
