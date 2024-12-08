import { DatasheetBaseComponent } from '../datasheet-base.component';

import { Component } from '@angular/core';

@Component({
	selector: 'datasheet-field',
	templateUrl: 'datasheet-field.component.html',
	styleUrls: ['../datasheet-base.scss']
})
export class DataSheetFieldComponent extends DatasheetBaseComponent {}
