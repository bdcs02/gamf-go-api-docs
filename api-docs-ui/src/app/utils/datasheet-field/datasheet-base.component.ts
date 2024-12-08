import { Clipboard } from '@angular/cdk/clipboard';
import { Directive, HostListener, Input } from '@angular/core';

@Directive()
export abstract class DatasheetBaseComponent {
	@Input() value: string | number | null | undefined;
	@Input() label = '';
	@Input() hasCopy = false;
	@Input() icon?: string;
	@Input() clickHandler?: (value: string | number | null | undefined) => void;

	constructor(protected readonly clipboard: Clipboard) {}

	@HostListener('click', ['$event'])
	public click(event: MouseEvent): void {
		if (this.clickHandler) {
			event.preventDefault();
			this.clickHandler(this.value);
		}
	}

	protected copyValue(): void {
		this.clipboard.copy(String(this.value));
	}

}
