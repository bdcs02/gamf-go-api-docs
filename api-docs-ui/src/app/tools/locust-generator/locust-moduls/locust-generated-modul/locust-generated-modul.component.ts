import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface GeneratedModulComponentOptions {
	generated: string;
}

@Component({
	selector: 'locust-generated-modul',
	templateUrl: './locust-generated-modul.component.html',
	styleUrl: './locust-generated-modul.component.scss'
})
export class LocustGeneratedModulComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public readonly data: GeneratedModulComponentOptions) {}
}
