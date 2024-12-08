import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
	selector: 'app-xml-viewer',
	templateUrl: './xml-viewer.component.html',
})
export class XmlViewerComponent {
	@Input() xmlContent!: string;

}
