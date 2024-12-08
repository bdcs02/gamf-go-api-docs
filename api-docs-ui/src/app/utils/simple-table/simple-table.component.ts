/* eslint-disable arrow-parens */
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';

import { CellDataPipe } from '../common-table/cell-data.pipe';
import { KeyOf, TableColumn, TableColumnType } from '../common-table/table-config';
import { DynamicPipe } from '../dynamic.pipe';
import { SimpleTableConfig } from './simple-table-config';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
	selector: 'simple-table',
	templateUrl: './simple-table.component.html',
	styleUrls: ['./simple-table.component.scss']
})
export class SimpleTableComponent<T> implements AfterViewInit, OnInit {
	@ViewChild(MatSort) matSort!: MatSort;
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@Input() config!: SimpleTableConfig<T>;
	@Input() dataSource!: MatTableDataSource<T>;
	@Input() tableName!: string;

	public displayedColumns: (KeyOf<T> | 'actions')[] = [];

	constructor(private readonly dynamicPipe: DynamicPipe) {}
	public ngOnInit(): void {
		this.dataSource = new MatTableDataSource<T>();
	}

	public ngAfterViewInit(): void {
		this.initDisplayedColumns();
		this.initDefaultSort();
	}

	public applyFilter(event: Event): void {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	public sort(sort: Sort): void {
		if (!sort.active || sort.direction === '') {
			this.dataSource.data = [...this.dataSource.data];
			return;
		}

		const isAsc = sort.direction === 'asc';
		const columnType = this.config.columns.find((column) => column.key === sort.active)?.type;

		this.dataSource.data.sort((a, b) => this.compare(String(a[sort.active as keyof T]), String(b[sort.active as keyof T]), columnType));

		if (!isAsc) {
			this.dataSource.data.reverse();
		}

		this.dataSource.data = [...this.dataSource.data];
	}

	public compare(a: string, b: string, type?: TableColumnType): number {
		let locale;
		let settings = {};

		if (type === 'number') {
			settings = { numeric: true };
		} else {
			locale = 'hu';
			settings = { sensitivity: 'base' };
		}

		return a.localeCompare(b, locale, settings);
	}

	public getTooltipContent(cellContent: string, column: TableColumn<T>): string {
		if (cellContent) {
			const cellDataPipe = new CellDataPipe(this.dynamicPipe, 'hu-HU');
			const formattedContent = String(cellDataPipe.transform(cellContent, column)) + '';

			return formattedContent;
		}
		return '';
	}

	private initDisplayedColumns(): void {
		for (const columnConfig of this.config.columns) {
			this.displayedColumns.push(columnConfig.key);
		}

		if (this.config.buttonConfig) {
			this.displayedColumns.push('actions');
		}
	}

	private initDefaultSort(): void {
		const defaultSort = this.config.defaultSort;
		if (!defaultSort) {
			return;
		}

		this.setSort({ active: defaultSort.key, direction: defaultSort.direction });
	}

	private setSort(sort: Sort): void {
		this.matSort.active = sort.active;
		this.matSort.direction = sort.direction;
		this.matSort.sortChange.emit({ active: this.matSort.active, direction: this.matSort.direction });
	}

	@ViewChild(MatPaginator)
	public set matPaginator(mp: MatPaginator) {
		this.paginator = mp;
		this.setDataSourceAttributes();
	}

	private setDataSourceAttributes(): void {
		if (this.dataSource) {
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.matSort;
		}
	}
}
