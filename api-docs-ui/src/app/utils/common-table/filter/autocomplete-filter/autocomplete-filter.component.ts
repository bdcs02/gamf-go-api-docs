import { AutocompleteValue } from '../../table-config';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';

@Component({
	selector: 'autocomplete-filter',
	templateUrl: 'autocomplete-filter.component.html',
	styleUrls: ['autocomplete-filter.component.scss']
})
export class AutocompleteFilterComponent implements OnChanges {
	@Input() label = '';
	@Input() options?: AutocompleteValue[] = [];

	@Output() selected = new EventEmitter<AutocompleteValue>();

	public filteredOptions!: Observable<AutocompleteValue[]>;
	public control = new FormControl('');

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.options.currentValue) {
			this.filteredOptions = this.control.valueChanges.pipe(
				startWith(''),
				map(value => this._filter(value || ''))
			);
		}
	}

	public optionSelected(selected: MatAutocompleteSelectedEvent): void {
		const option = this.options?.find(o => o.value === selected.option.value);
		if (option) {
			this.selected.emit(option);
			this.control.setValue('');
		}
	}

	private _filter(value: string): AutocompleteValue[] {
		const filterValue = value.toLowerCase();

		return this.options?.filter(option => option.displayValue.toLowerCase().includes(filterValue)) ?? [];
	}
}
