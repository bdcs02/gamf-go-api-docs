import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogComponentOptions {
	componentName: string;
	title: string;
	description: string;
}

@Component({
	selector: 'confirm-dialog',
	templateUrl: './confirm-dialog.component.html',
	styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public readonly data: ConfirmDialogComponentOptions) {}
}
