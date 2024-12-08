import { AbstractFormFieldComponent } from '../abstract-form-field.component';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { filter, map, merge, Observable, startWith } from 'rxjs';

@Component({
	selector: 'selection-list',
	templateUrl: 'selection-list.component.html',
	styleUrls: ['selection-list.component.scss', '../form-fields.scss']
})
export class SelectionListComponent<T> extends AbstractFormFieldComponent implements ControlValueAccessor, OnInit, OnChanges {
	@ViewChild('input') input!: ElementRef<HTMLInputElement>;
	@Input() elements: T[] = [];
	@Input() compareKey?: keyof T;
	@Output() selectionChange: EventEmitter<null> = new EventEmitter();

	public allElements: T[] = [];
	public selectedElements: T[] = [];
	public filteredElements!: Observable<T[]>;

	public control = new FormControl();
	public separatorKeysCodes: number[] = [ENTER, COMMA];
	@Input() displayFormat: (element: T) => string = (element: T) => String(element);

	public override ngOnInit(): void {
		super.ngOnInit();
		this.filteredElements = merge(this.control.valueChanges, this.selectionChange).pipe(
			startWith(null),
			filter(item => typeof item === 'string' || !item),
			map((item: string | null) => (item ? this.filter(item) : this.allElements.slice()))
		);
		this.allElements = JSON.parse(JSON.stringify(this.elements));
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.allElements = changes.elements.currentValue.filter((newElement: T) => !this.selectedElements.find(selectedElement => {
			if (this.compareKey) {
				return newElement[this.compareKey] === selectedElement[this.compareKey];
			}
			return newElement === selectedElement;
		}));

		this.selectionChange.emit();
	}

	public add(element: string | T): void {
		this.markAsTouched();

		if (typeof element === 'string') {
			const value = (element || '').trim();

			const item = this.allElements.find(e => this.displayFormat(e) === value);

			if (!item) {
				return;
			}
			this.addItem(item);
		} else {
			this.addItem(element);
		}
	}

	public addItem(item: T): void {
		this.selectedElements.push(item);

		// Clear the input value
		this.input.nativeElement.value = '';

		this.control.setValue(null);

		this.onChange(this.selectedElements);
		this.removeSelected(item);
	}

	public remove(element: T): void {
		this.markAsTouched();
		const index = this.selectedElements.indexOf(element);

		if (index >= 0 && !this.disabled) {
			this.selectedElements.splice(index, 1);
			this.allElements.push(element);
			this.allElements.sort((a, b) => this.displayFormat(a).localeCompare(this.displayFormat(b)));
			this.selectionChange.emit();
		}
		this.onChange(this.selectedElements);
	}

	public selected(event: MatAutocompleteSelectedEvent): void {
		const item = this.allElements.find(e => this.displayFormat(e).trim() === event.option.viewValue);
		if (item) {
			this.selectedElements.push(item);
			this.input.nativeElement.value = '';
			this.removeSelected(item);
			this.control.setValue(null);
			this.selectionChange.emit();
			this.onChange(this.selectedElements);
		}
	}

	public override writeValue(value: unknown): void {
		super.writeValue(value);
		setTimeout(() => {
			if (value) {
				for (const iterator of value as T[]) {
					this.add(iterator);
				}
			}
			this.onChange(this.selectedElements);
		}, 0);
	}

	public removeSelected(element: T): void {
		const index = this.allElements.findIndex(item => {
			if (this.compareKey) {
				return item[this.compareKey] === element[this.compareKey];
			}
			return item === element;
		});

		if (index >= 0 && !this.disabled) {
			this.allElements.splice(index, 1);
		}
	}

	private filter(value: string): T[] {
		const filterValue = value.toLowerCase();

		return this.allElements.filter(element => this.displayFormat(element).toLowerCase().includes(filterValue));
	}
}
