/* eslint-disable arrow-parens */
import { AbstractFormFieldComponent } from '../abstract-form-field.component';

import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	QueryList,
	SimpleChanges,
	ViewChild,
	ViewChildren,
	ViewEncapsulation
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { delay, map, Observable, of, startWith, Subscription } from 'rxjs';

@Component({
	selector: 'dropdown-list',
	templateUrl: 'dropdown-list.component.html',
	styleUrls: ['dropdown-list.component.scss', '../form-fields.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DropdownListComponent<T> extends AbstractFormFieldComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
	@ViewChild('select') matSelect!: MatSelect;
	@ViewChildren('searchSelectInput') searchSelectInput!: QueryList<ElementRef<HTMLInputElement>>;

	@Input() items: T[] = [];
	@Input() valueKey!: keyof T;
	@Input() displayKey!: keyof T;
	@Input() deletedKey!: keyof T;
	@Input() activeKey!: keyof T;
	@Input() searchable = false;
	@Input() allowCustomValue = false;
	@Input() value?: T;
	@Output() selectionChange: EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();

	public allElements: T[] = [];
	public selectedElement: T | undefined;
	public filteredElements!: Observable<T[]>;
	public inputControl = new FormControl('');

	public customItem?: T;

	private openChangeSubscription?: Subscription;

	@Input() displayFormat: (element: T) => string = (element: T) => String(element);

	public override ngOnInit(): void {
		super.ngOnInit();
		this.allElements = JSON.parse(JSON.stringify(this.items));
		this.filteredElements = this.inputControl.valueChanges.pipe(
			startWith(null),
			map((item: string | null) => (item ? this.filter(item) : this.allElements.slice()))
		);
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.allElements = changes.items?.currentValue.filter((item: T) => {
			if (!this.selectedElement) {
				return true;
			}
			if (this.valueKey) {
				return item[this.valueKey] === this.selectedElement[this.valueKey];
			}
			return item === this.selectedElement;
		});

		this.filteredElements = of([...this.allElements]);
	}

	public ngAfterViewInit(): void {
		this.openChangeSubscription = this.matSelect.openedChange.pipe(delay(1)).subscribe((opened) => {
			if (opened) {
				this.opened();
				this.focus();
			} else {
				this.reset();
			}
		});
	}

	public ngOnDestroy(): void {
		this.openChangeSubscription?.unsubscribe();
	}

	public onSelectionChange(change: MatSelectChange): void {
		this.selectionChange.emit(change);
	}

	public opened(): void {
		this.filteredElements = this.inputControl.valueChanges.pipe(
			startWith(null),
			map((item: string | null) => (item ? this.filter(item) : this.allElements.slice()))
		);
	}

	public reset(): void {
		this.inputControl.setValue(null);
		this.onChange(this.formControl.value);
	}

	public focus(): void {
		this.searchSelectInput.first?.nativeElement.focus();
	}

	public isDisabled(item: T): boolean {
		return ((this.deletedKey && item[this.deletedKey]) || (this.activeKey && !item[this.activeKey])) as boolean;
	}

	public addCustomItem(event: Event): void {
		event.stopPropagation();

		if (this.customItem) {
			this.items = this.items.filter((item) => item !== this.customItem);
		}

		const newItem = {
			[this.displayKey]: this.searchSelectInput.first?.nativeElement.value
		} as T;

		this.items.splice(0, 0, newItem);
		this.ngOnInit();

		this.customItem = newItem;

		if (!this.valueKey) {
			this.formControl.setValue(newItem);
		} else if (this.valueKey === this.displayKey) {
			this.formControl.setValue(newItem[this.displayKey]);
		}

		this.matSelect.close();
		this.selectionChange.emit({ source: this.matSelect, value: this.formControl.value });
	}

	private filter(value: string): T[] {
		const filterValue = value.toLowerCase();
		if (this.displayKey) {
			return this.allElements.filter((element) => String(element[this.displayKey]).toLowerCase().includes(filterValue));
		} else {
			return this.allElements.filter((element) => this.displayFormat(element).toLowerCase().includes(filterValue));
		}
	}
}
