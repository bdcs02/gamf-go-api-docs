import { TableColumn, TableConfig, TableSortDirection } from '../table-config';

import { Component, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
	selector: 'sort',
	templateUrl: 'sort.component.html',
	styleUrls: ['sort.component.scss']
})
export class SortComponent<T> implements OnChanges {
	@Input() config!: TableConfig<T>;
	@Input() loading: boolean | null = false;

	public sortChange: EventEmitter<void> = new EventEmitter();

	public directions = TableSortDirection;
	public direction: TableSortDirection = TableSortDirection.asc;

	public sortableColumns: TableColumn<T>[] = [];
	public selected: TableColumn<T> | undefined;

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['config']) {
			this.updateSortableColumns();
		}
	}

	public updateSortableColumns(): void {
		this.sortableColumns = [];

		for (const column of this.config.columns) {
			if (column.sortable === undefined || column.sortable === true) {
				this.sortableColumns.push(column);
			}
		}

		const defaultSort = this.config.defaultFilter?.sort;

		if (defaultSort) {
			this.sortableColumns.forEach(sortableColumn => {
				if (sortableColumn.key === defaultSort.key) {
					this.selected = sortableColumn;
					this.direction = defaultSort.direction;
				}
			});
		}
	}

	public selectionChange(): void {
		this.sortChange.emit();
	}

	public toggleDirection(): void {
		if (this.loading) {
			return;
		}

		this.direction = this.direction === TableSortDirection.asc ? TableSortDirection.desc : TableSortDirection.asc;
		this.sortChange.emit();
	}
}
