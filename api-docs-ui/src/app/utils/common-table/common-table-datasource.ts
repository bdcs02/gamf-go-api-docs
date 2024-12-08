import { TableRequest, TableRequestFunction } from './table-config';

import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, first, Observable } from 'rxjs';

export class CommonTableDatasource<T> implements DataSource<T> {
	public data: Observable<T[]>;
	public loading: Observable<boolean>;
	public count: Observable<number>;

	private dataSubject = new BehaviorSubject<T[]>([]);
	private loadingSubject = new BehaviorSubject<boolean>(false);
	private countSubject = new BehaviorSubject<number>(0);

	private requestFunction!: TableRequestFunction<T>;

	constructor(requestFunction: TableRequestFunction<T>) {
		this.data = this.dataSubject.asObservable();
		this.loading = this.loadingSubject.asObservable();
		this.count = this.countSubject.asObservable();
		this.requestFunction = requestFunction;
	}

	public connect(): Observable<T[]> {
		return this.dataSubject.asObservable();
	}

	public disconnect(): void {
		this.dataSubject.complete();
		this.loadingSubject.complete();
		this.countSubject.complete();
	}

	public loadData(tableFilter: TableRequest<T>): void {
		this.loadingSubject.next(true);
		this.requestFunction(tableFilter)
			.pipe(first())
			.subscribe({
				next: tableData => {
					this.dataSubject.next(tableData.data || []);
					this.countSubject.next(tableData.count);
					this.loadingSubject.next(false);
				},
				error: () => {
					this.loadingSubject.next(false);
				}
			});
	}

	public clear(): void {
		this.dataSubject.next([]);
		this.countSubject.next(0);
	}
}
