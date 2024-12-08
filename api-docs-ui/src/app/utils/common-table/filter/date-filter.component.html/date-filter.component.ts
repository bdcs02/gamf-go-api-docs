import { Component, EventEmitter, Output } from '@angular/core';

export type DateFilterType = 'date' | 'date-range';

@Component({
	selector: 'date-filter',
	templateUrl: 'date-filter.component.html',
	styleUrls: ['./date-filter.component.scss']
})
export class DateFilterComponent {
	@Output() dateChange = new EventEmitter<Date | { lt: Date; gt: Date }>();

	public dateFilterTypes: DateFilterType[] = ['date', 'date-range'];
	public selectedType: DateFilterType = 'date';

	public value: Date | { lt: Date; gt: Date } | undefined;

	public startDate: Date | undefined;
	public endDate: Date | undefined;

	public dateRangeInput(): void {
		if (this.startDate && this.endDate) {
			this.dateChange.emit({
				gt: this.startDate,
				lt: this.endDate
			});
		}
	}

	public dateInput(): void {
		this.dateChange.emit(this.value);
	}

	public clear(): void {
		this.value = undefined;
		this.startDate = undefined;
		this.endDate = undefined;
	}
}
