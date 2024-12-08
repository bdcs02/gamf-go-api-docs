import { AutocompleteValue, TableColumn, TableConfig, TableRequestFilter } from '../table-config';
import { DateFilterComponent } from './date-filter.component.html/date-filter.component';

import { formatDate } from '@angular/common';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DateTime } from 'luxon';

interface FilterEntry<T> {
	column: TableColumn<T>;
	value: unknown;
	displayValue: string;
	dateType?: 'date' | 'range';
}

type FilterValueType = string | Date | number | { lt: Date; gt: Date } | boolean | undefined;

@Component({
	selector: 'filter',
	templateUrl: 'filter.component.html',
	styleUrls: ['filter.component.scss']
})
export class FilterComponent<T> implements OnChanges {
	@Input() config!: TableConfig<T>;
	@Input() loading: boolean | null = false;
	@ViewChildren(DateFilterComponent) dateFilter!: QueryList<DateFilterComponent>;

	public filterChange: EventEmitter<void> = new EventEmitter();

	public filterableColumns: TableColumn<T>[] = [];
	public filters: FilterEntry<T>[] = [];
	public selected: TableColumn<T> | undefined;
	public value: FilterValueType;
	public maxFilterLength = 100;

	constructor(@Inject(LOCALE_ID) private readonly locale: string, private readonly translateService: TranslateService) {}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['config']) {
			this.updateFilterableColumns();
		}
	}

	public updateFilterableColumns(): void {
		this.filterableColumns = [];
		for (const column of this.config.columns) {
			if (column.filter) {
				this.filterableColumns.push(column);

				// set deafult filter
				if (column.defaultFilter) {
					this.selected = column;
				}
			}
		}
	}

	public filter(): void {
		if (!this.filters.find(entry => entry.value === this.value && entry.column === this.selected)) {
			this.addCurrentFilter();
			this.filterChange.emit();
		}
	}

	public getTableRequestFilters(): TableRequestFilter<T>[] {
		return this.filters.map(filter => {
			if (filter.dateType === 'range') {
				const value = filter.value as { gt: Date; lt: Date };
				return {
					key: filter.column.filterKey ?? filter.column.key,
					value: { gt: value.gt, lt: DateTime.fromJSDate(value.lt).plus({ day: 1 }).toJSDate() },
					dateType: filter.dateType
				};
			}
			return {
				key: filter.column.filterKey ?? filter.column.key,
				value: filter.value as string,
				dateType: filter.dateType
			};
		});
	}

	public remove(filter: FilterEntry<T>): void {
		this.filters = this.filters.filter(f => f.column.key !== filter.column.key || f.value !== filter.value);
		this.filterChange.emit();
	}

	public clear(): void {
		this.filters = [];
	}

	public selectionChange(): void {
		if (this.selected?.type === 'icon') {
			this.value = false;
		} else {
			this.value = undefined;
		}
	}

	public dateChange(value: FilterValueType): void {
		this.value = value;
	}

	public addDefaults(filter: TableRequestFilter<T>[]): void {
		for (const f of filter) {
			const column = this.config.columns.find(c => (c.filterKey ?? c.key) === f.key);
			if (column) {
				this.appendFilter(f.value, column);
			}
		}
	}

	public autocompleteSelected(autocompleteValue: AutocompleteValue): void {
		if (this.selected) {
			this.filters.push({
				column: this.selected,
				value: autocompleteValue.value,
				displayValue: autocompleteValue.displayValue
			});
		}
		this.filterChange.emit();
	}

	private addCurrentFilter(): void {
		if (this.selected && this.value !== undefined) {
			this.appendFilter(this.value, this.selected);
		}
		this.selectionChange();
	}

	private appendFilter(value: FilterValueType, selected: TableColumn<T>): void {
		switch (selected?.filter) {
			case 'date':
				this.addDateFilter(value, selected);
				break;
			case 'enum':
				this.filters.push({
					column: selected,
					value,
					displayValue: this.translateService.instant(selected.filterValues?.find(v => v.value === value)?.translateKey ?? '')
				});
				break;
			case 'autocomplete':
				this.filters.push({
					column: selected,
					value,
					displayValue: selected.autocompleteValues?.find(v => v.value === value)?.displayValue ?? ''
				});
				break;
			default:
				this.filters.push({
					column: selected,
					value,
					displayValue: String(value)
				});
				break;
		}
	}

	private addDateFilter(value: FilterValueType, selected: TableColumn<T>): void {
		if (value && typeof value === 'object' && !(value instanceof Date)) {
			this.filters.push({
				column: selected,
				value,
				dateType: 'range',
				displayValue: `
						${formatDate(value.gt, 'yyyy.MM.dd.', this.locale)}
						 -
						${formatDate(value.lt, 'yyyy.MM.dd.', this.locale)}
					`
			});
		} else {
			const to = new Date(value as Date);
			this.filters.push({
				column: selected,
				value: {
					gt: value,
					lt: new Date(to.setDate(to.getDate() + 1))
				},
				dateType: 'date',
				displayValue: `${formatDate(value as string, 'yyyy.MM.dd.', this.locale)}`
			});
		}
		this.clearDateFilter();
	}

	private clearDateFilter(): void {
		this.dateFilter.first?.clear();
	}
}
