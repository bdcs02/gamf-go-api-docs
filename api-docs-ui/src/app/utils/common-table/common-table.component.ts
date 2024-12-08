import { DynamicPipe } from '../dynamic.pipe';
import { CellDataPipe } from './cell-data.pipe';
import { CommonTableDatasource } from './common-table-datasource';
import { FilterComponent } from './filter/filter.component';
import { KeyOf, RowClickFunction, TableColumn, TableConfig, TableRequest, TableRequestFilter, TableSortDirection } from './table-config';

import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter, merge, Subscription, tap } from 'rxjs';

@Component({
	selector: 'common-table',
	templateUrl: 'common-table.component.html',
	styleUrls: ['common-table.component.scss']
})
export class CommonTableComponent<T> implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(FilterComponent) filter!: FilterComponent<T>;

	@Input() config!: TableConfig<T>;

	public displayedColumns: (KeyOf<T> | 'actions')[] = [];
	public dataSource!: CommonTableDatasource<T>;
	public missingFilter: string[] = [];

	private changeSubscription!: Subscription;
	private navigationSubscription!: Subscription;
	private hadPopstate = false;

	constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly dynamicPipe: DynamicPipe) {
		this.navigationSubscription = this.router.events
			.pipe(filter(e => e instanceof NavigationEnd || e instanceof NavigationStart))
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.subscribe((e: any) => {
				if (e instanceof NavigationStart && e.navigationTrigger === 'popstate') {
					this.hadPopstate = true;
				}
				if (e instanceof NavigationEnd && this.hadPopstate) {
					this.changeSubscription.unsubscribe();
					this.resetConfigState();
					this.parseRequestFromQueryParams();
					this.filter.clear();
					this.initTable();
					this.hadPopstate = false;
					this.initSubscriptions();
				}
			});
	}

	public rowClickFunction: RowClickFunction<T> = () => {
		/* No body needed*/
	};

	public ngOnInit(): void {
		this.dataSource = new CommonTableDatasource(this.config.requestFunction);
		this.getDisplayedColumns();
		if (this.config.rowClickFunction) {
			this.rowClickFunction = this.config.rowClickFunction;
		}
	}

	public ngAfterViewInit(): void {
		if (this.hadPopstate) {
			return;
		}
		setTimeout(() => {
			this.parseRequestFromQueryParams();
			this.setMissingFilter(this.config.defaultFilter?.filter || []);
			this.initTable();
			this.initSubscriptions();
		}, 0);
	}

	public ngOnDestroy(): void {
		this.changeSubscription?.unsubscribe();
		this.navigationSubscription?.unsubscribe();
	}

	public getTooltipContent(cellContent: string, column: TableColumn<T>): string {
		if (cellContent) {
			const cellDataPipe = new CellDataPipe(this.dynamicPipe, 'hu-HU');
			const formattedContent = String(cellDataPipe.transform(cellContent, column)) + '';

			return formattedContent;
		}
		return '';
	}

	public getRequest(): TableRequest<T> {
		const sort = {
			key: this.sort.active as KeyOf<T>,
			direction: this.sort.direction === 'desc' ? TableSortDirection.desc : TableSortDirection.asc
		};
		const pagination = {
			pageIndex: this.paginator.pageIndex,
			pageSize: this.paginator.pageSize
		};
		const tableFilter = this.filter.getTableRequestFilters();
		this.setMissingFilter(tableFilter);

		if (sort.key) {
			return { pagination, filter: tableFilter, sort };
		} else {
			return {
				pagination,
				filter: tableFilter
			};
		}
	}

	public refreshData(): void {
		this.loadData(this.getRequest());
	}

	public hasDisplayedButtons(row: T): boolean {
		if (this.config.buttonConfig) {
			for (const button of this.config.buttonConfig.buttons) {
				if (button.hidden && !button.hidden(row)) {
					return true;
				}
			}
		}
		return false;
	}

	private initTable(): void {
		if (this.config.defaultFilter) {
			this.setSort(this.config.defaultFilter);
			if (this.config.defaultFilter.filter) {
				this.filter.addDefaults(this.config.defaultFilter.filter);
			}
			this.setPagination(this.config.defaultFilter);
			this.loadData(this.getRequest());
		} else {
			this.loadData(this.getRequest());
		}
	}

	private initSubscriptions(): void {
		this.changeSubscription = merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				tap(async () => {
					const request = this.getRequest();
					await this.addRequestToQueryParams(request);
					this.loadData(request);
				})
			)
			.subscribe();
		this.changeSubscription.add(
			this.filter.filterChange.subscribe(async () => {
				this.paginator.pageIndex = 0;
				const request = this.getRequest();
				await this.addRequestToQueryParams(request);
				this.loadData(request);
			})
		);
	}

	private getDisplayedColumns(): void {
		for (const columnConfig of this.config.columns) {
			if (!columnConfig.hidden) {
				this.displayedColumns.push(columnConfig.key);
			}
		}

		if (this.config.buttonConfig && this.config.buttonConfig.buttons && this.config.buttonConfig.buttons.length > 0) {
			this.displayedColumns.push('actions');
		}
	}

	private loadData(request: TableRequest<T>): void {
		if (this.missingFilter.length === 0) {
			this.dataSource.loadData(request);
		} else {
			this.dataSource.clear();
		}
	}

	private setMissingFilter(requestFilter: TableRequestFilter<T>[]): void {
		this.missingFilter = [];
		if (this.config.requiredFilter) {
			const currentFilters = requestFilter.map(f => f.key);
			for (const required of this.config.requiredFilter) {
				if (!currentFilters?.includes(required)) {
					const translateKey = this.config.columns.find(col => col.key === required)?.translateKey;
					if (translateKey) {
						this.missingFilter.push(translateKey);
					}
				}
			}
		}
	}

	private async addRequestToQueryParams(request: TableRequest<T>): Promise<void> {
		const queryParams = { tableFilter: JSON.stringify(request) };
		await this.router.navigate([], {
			relativeTo: this.route,
			queryParams,
			queryParamsHandling: 'merge'
		});
	}

	private parseRequestFromQueryParams(): void {
		const tableFilterParam = this.route.snapshot.queryParamMap.get('tableFilter');
		if (tableFilterParam) {
			let tableFilter: TableRequest<T>;
			try {
				tableFilter = JSON.parse(tableFilterParam);
			} catch {
				return;
			}
			const defaultFilter: TableRequest<T> = {};
			defaultFilter.sort = tableFilter.sort;

			defaultFilter.pagination = tableFilter.pagination;
			if (tableFilter.filter) {
				this.restoreTableFilterTypes(tableFilter.filter);
				defaultFilter.filter = tableFilter.filter;
			} else {
				defaultFilter.filter = this.config.defaultFilter?.filter ?? [];
			}
			this.config.defaultFilter = defaultFilter;
		}
	}

	private restoreTableFilterTypes(tableFilter: TableRequestFilter<T>[]): TableRequestFilter<T>[] {
		for (const column of this.config.columns) {
			const queryFilter = tableFilter.find(f => f.key === (column.filterKey ?? column.key));
			if (queryFilter && column.filter === 'date') {
				if (queryFilter.dateType === 'date') {
					queryFilter.value = new Date((queryFilter.value as { gt: Date }).gt);
				} else {
					queryFilter.value = {
						gt: new Date((queryFilter.value as { gt: Date }).gt),
						lt: new Date((queryFilter.value as { lt: Date }).lt)
					};
				}
			}
		}
		return tableFilter;
	}

	private setSort(request: TableRequest<T>): void {
		if (request.sort) {
			this.sort.active = request.sort.key;
			this.sort.direction = request.sort.direction;
			this.sort.sortChange.emit({ active: this.sort.active, direction: this.sort.direction });
		}
	}

	private setPagination(request: TableRequest<T>): void {
		if (request.pagination) {
			this.paginator.pageIndex = request.pagination.pageIndex;
			this.paginator.pageSize = request.pagination.pageSize;
		}
	}

	private resetConfigState(): void {
		this.config.defaultFilter = {};
		this.sort.active = '';
		this.sort.direction = TableSortDirection.asc;
		this.sort.sortChange.emit();
		this.paginator.pageIndex = 0;
		this.paginator.pageSize = 10;
	}
}
