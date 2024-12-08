import { PipeTransform, Type } from '@angular/core';
import { Observable } from 'rxjs';

export type KeyOf<T> = Extract<keyof T, string>;
export type TableColumnType = 'string' | 'date' | 'datetime' | 'number' | 'boolean' | 'icon' | 'buttons' | 'custom';
export type TableButtonColor = 'primary' | 'accent' | 'warn';
export type TableFilterType = 'string' | 'number' | 'date' | 'boolean' | 'enum' | 'autocomplete';
export type TableRequestFunction<T> = (filter: TableRequest<T>) => Observable<TableData<T>>;
export type TableIconFunction = (rowValue: unknown) => string;
export enum TableSortDirection {
	asc = 'asc',
	desc = 'desc'
}
export type RowClickFunction<T> = (rowValue: T) => void | unknown;

export interface TableData<T> {
	count: number;
	data?: T[];
}

export interface TableColumn<T> {
	key: KeyOf<T>;
	translateKey: string;
	type: TableColumnType;
	pipe?: Type<PipeTransform>;
	pipeArgs?: unknown;
	filter?: TableFilterType;
	filterValues?: FilterValues[];
	filterKey?: KeyOf<T>;
	icon?: TableIconFunction;
	hidden?: boolean;
	sortable?: boolean;
	clickable?: (data: T) => boolean;
	onClick?: (data: T) => void;
	tooltip?: (data: T) => string;
	autocompleteValues?: AutocompleteValue[];
	defaultFilter?: boolean;
}

export interface TableButton<T> {
	icon: string;
	translateKey: string;
	color?: TableButtonColor;
	onClick: (data: T) => void;
	hidden?: (data: T) => boolean;
}

export interface TableConfig<T> {
	columns: TableColumn<T>[];
	buttonConfig?: {
		menu: boolean;
		titleTranslateKey?: string;
		buttons: TableButton<T>[];
	};
	rowClickFunction?: RowClickFunction<T>;
	requestFunction: TableRequestFunction<T>;
	defaultFilter?: TableRequest<T>;
	/**
	 * At least one of these keys is required to start a request
	 */
	requiredFilter?: KeyOf<T>[];
	hideFilter?: boolean;
	hidePaginator?: boolean;
}

export interface TableRequestFilter<T> {
	key: KeyOf<T>;
	value: number | string | Date | { lt: Date; gt: Date };
	exactSearch?: boolean;
	dateType?: 'date' | 'range';
}

export interface TableRequest<T> {
	sort?: {
		key: KeyOf<T>;
		direction: TableSortDirection;
	};
	filter?: TableRequestFilter<T>[];
	pagination?: {
		pageIndex: number;
		pageSize: number;
	};
}

export interface FilterValues {
	translateKey: string;
	value: string | { gt: string; lt: string };
}

export interface AutocompleteValue {
	value: string;
	displayValue: string;
}

export function createQueryTableFilter<T>(
	requestFilter: TableRequestFilter<T>,
	sort?: {
		key: KeyOf<T>;
		direction: TableSortDirection;
	}
): { tableFilter: string } {
	return { tableFilter: JSON.stringify({ filter: [requestFilter], sort }) };
}
