import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

export interface PaginationTranslation {
	itemsPerPage: string;
	nextPage: string;
	previousPage: string;
	firstPage: string;
	lastPage: string;
}

@Injectable()
export class PaginationTranslationService extends MatPaginatorIntl {
	private defaultTranslation: PaginationTranslation = {
		itemsPerPage: 'Items per page:',
		nextPage: 'Next page',
		previousPage: 'Previous page',
		firstPage: 'First page',
		lastPage: 'Last page'
	};

	constructor(private readonly translateService: TranslateService) {
		super();
		this.itemsPerPageLabel = this.translateService.instant('pagination.itemsPerPage');
		this.nextPageLabel = this.translateService.instant('pagination.nextPage');
		this.previousPageLabel = this.translateService.instant('pagination.previousPage');
		this.lastPageLabel = this.translateService.instant('pagination.lastPage');
		this.firstPageLabel = this.translateService.instant('pagination.firstPage');
	}

	public override getRangeLabel = (page: number, pageSize: number, length: number): string => {
		if (length === 0 || pageSize === 0) {
			return `0 / ${length}`;
		}
		length = Math.max(length, 0);
		const startIndex = page * pageSize;
		const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
		return `${startIndex + 1} - ${endIndex} / ${length}`;
	};
}
