import { KeyOf, TableColumnType, TableIconFunction, TableSortDirection } from '../common-table/table-config';

export interface SimpleTableConfig<T> {
	columns: SimpleTableColumn<T>[];
	defaultSort?: {
		key: KeyOf<T>;
		direction: TableSortDirection;
	};
	buttonConfig?: {
		menu: boolean;
		titleTranslateKey?: string;
		buttons: SimpleTableButton<T>[];
	};
}

export interface SimpleTableColumn<T> {
	key: KeyOf<T>;
	translateKey: string;
	type: TableColumnType;
	sortable?: boolean;
	icon?: TableIconFunction;
	tooltip?: (data: T) => string;
}

export interface SimpleTableButton<T> {
	icon: string;
	translateKey: string;
	onClick: (data: T) => void;
	hidden?: (data: T) => boolean;
}
