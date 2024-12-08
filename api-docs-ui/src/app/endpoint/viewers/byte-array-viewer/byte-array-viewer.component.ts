import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-byte-array-viewer',
	templateUrl: './byte-array-viewer.component.html',
})
export class ByteArrayViewerComponent {
	@Input() byteContent!: string;
}
