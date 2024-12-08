import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { DynamicPipe } from '../dynamic.pipe';
import { TableColumn } from './table-config';

@Pipe({
	name: 'translateCell'
})
export class TranslateCellPipe implements PipeTransform {
	constructor(private readonly dynamicPipe: DynamicPipe, private readonly translateService: TranslateService) { }

	public transform<T>(value: unknown, columnConfig: TableColumn<T>): unknown {
		return typeof columnConfig === 'string' ? this.translateService.instant(String(columnConfig) + String(value)) : value;
	}
}
