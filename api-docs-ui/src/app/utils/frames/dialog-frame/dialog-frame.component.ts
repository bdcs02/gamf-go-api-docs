import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'dialog-frame',
	templateUrl: 'dialog-frame.component.html',
	styleUrls: ['dialog-frame.component.scss']
})
export class DialogFrameComponent {
	@Input() name = 'Dialog';
	@Input() confirmDisabled = false;
	@Output() confirmClicked: EventEmitter<void> = new EventEmitter<void>();
	@Output() cancelClicked: EventEmitter<void> = new EventEmitter<void>();

	public onConfirmClicked(): void {
		this.confirmClicked.emit();
	}

	public onCancelClicked(): void {
		this.cancelClicked.emit();
	}
}
