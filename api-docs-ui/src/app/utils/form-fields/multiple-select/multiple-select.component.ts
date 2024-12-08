import { DropdownListComponent } from '../dropdown-list/dropdown-list.component';

import { Component } from '@angular/core';

@Component({
	selector: 'multiple-select',
	templateUrl: 'multiple-select.component.html',
	styleUrls: ['multiple-select.component.scss', '../form-fields.scss']
})
export class MultipleSelectComponent<T> extends DropdownListComponent<T> {}
