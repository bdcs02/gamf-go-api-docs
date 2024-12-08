import { DynamicPipe } from '../dynamic.pipe';
import { TableColumn } from './table-config';

import { formatDate } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'cellData'
})
export class CellDataPipe implements PipeTransform {
	constructor(private readonly dynamicPipe: DynamicPipe, @Inject(LOCALE_ID) private readonly locale: string) {}

	public transform<T>(value: unknown, columnConfig: TableColumn<T>): unknown {
		if (columnConfig.type === 'date' && value) {
			return formatDate(value as string, 'yyyy.MM.dd. HH:mm:ss', this.locale);
		} else if (columnConfig.type === 'datetime') {
			return formatDate(value as string, 'yyyy.MM.dd HH:mm:ss', this.locale);
		} else if (columnConfig.type === 'custom' && columnConfig.pipe) {
			return this.dynamicPipe.transform(value, columnConfig.pipe, columnConfig.pipeArgs);
		} else {
			return value;
		}
	}
}
