import { SimpleTableConfig } from 'src/app/utils/simple-table/simple-table-config';
import { GlobalsListItem } from 'src/app/database/global-variables';
import { TableSortDirection } from 'src/app/utils/common-table/table-config';

export function variableTableConfig(
): SimpleTableConfig<GlobalsListItem> {
	return {
		columns: [

			{
				key: 'key',
				type: 'string',
				translateKey: 'common.name',
				sortable: true
			},
			{
				key: 'value',
				type: 'string',
				translateKey: 'common.value',
				sortable: true
			},
		],
		defaultSort: {
			key: 'key',
			direction: TableSortDirection.asc
		}
	};
}
