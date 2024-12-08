import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-text-viewer',
	templateUrl: './text-viewer.component.html',
})
export class TextViewerComponent {
	@Input() text!: string;
}
