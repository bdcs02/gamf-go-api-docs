import { Input } from '@angular/core';
import { Component } from '@angular/core';

@Component({
	selector: 'text-request-body',
	templateUrl: './text-request-body.component.html',
	styleUrl: './text-request-body.component.scss'
})
export class TextRequestBodyComponent {
	@Input() body: string = '';
}
