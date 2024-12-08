import { RowClickFunction, TableSortDirection } from 'src/app/utils/common-table/table-config';
import { RequestListItem } from './request';
import { SimpleTableConfig } from 'src/app/utils/simple-table/simple-table-config';

export function loadRequestTableConfig(
	deleteRequest: RowClickFunction<RequestListItem>,
	loadRequest: RowClickFunction<RequestListItem>,
	exportRequest: RowClickFunction<RequestListItem>
): SimpleTableConfig<RequestListItem> {
	return {
		columns: [

			{
				key: 'name',
				type: 'string',
				translateKey: 'common.name',
				sortable: true
			},
			{
				key: 'version',
				type: 'string',
				translateKey: 'common.version',
				sortable: true
			},
			{
				key: 'createDate',
				type: 'date',
				translateKey: 'common.date',
				sortable: true
			}
		],
		defaultSort: {
			key: 'name',
			direction: TableSortDirection.asc,
		},
		buttonConfig: {
			menu: true,
			titleTranslateKey: 'table.actions',
			buttons: [
				{
					icon: 'delete',
					translateKey: 'common.delete',
					onClick: data => deleteRequest(data)
				},
				{
					icon: 'cloud_download',
					translateKey: 'common.export',
					onClick: data => exportRequest(data)
				},
				{
					icon: 'cached',
					translateKey: 'common.load',
					onClick: async data => await loadRequest(data)
				}
			]
		},
	};
}
