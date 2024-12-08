import { Component, Input, OnInit } from '@angular/core';
import { MethodColor } from './color';

@Component({
	selector: 'method-chip',
	templateUrl: './method-chip.component.html',
	styleUrl: './method-chip.component.scss'
})
export class MethodChipComponent implements OnInit {
	@Input() text!: string;

	@Input() backgroundColor: string = MethodColor.UNKNOWN;

	public ngOnInit(): void {
		switch (this.text) {
			case 'GET': {
				this.backgroundColor = MethodColor.GET;
				break;
			}
			case 'POST': {
				this.backgroundColor =  MethodColor.POST;
				break;
			}
			case 'PUT': {
				this.backgroundColor =  MethodColor.PUT;
				break;
			}
			case 'DELETE': {
				this.backgroundColor =  MethodColor.DELETE;
				break;
			}
			case 'HEAD': {
				this.backgroundColor =  MethodColor.HEAD;
				break;
			}
			case 'CONNECT': {
				this.backgroundColor =  MethodColor.CONNECT;
				break;
			}
			case 'OPTIONS': {
				this.backgroundColor =  MethodColor.OPTIONS;
				break;
			}
			case 'TRACE': {
				this.backgroundColor =  MethodColor.TRACE;
				break;
			}
			case 'PATCH': {
				this.backgroundColor =  MethodColor.PATCH;
				break;
			}
		}
	}
}
