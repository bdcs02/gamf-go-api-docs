import { Component, Input } from '@angular/core';
import { EndpointForm } from '../endpoint-form';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'header-list',
	templateUrl: './header-list.component.html'
})
export class HeaderListComponent {
	@Input() public formGroup!: FormGroup<EndpointForm>;
}
