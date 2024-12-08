import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EndpointForm } from '../endpoint-form';

@Component({
	selector: 'url-parameters',
	templateUrl: './url-parameters.component.html',
})
export class UrlParametersComponent {
	@Input() public formGroup!: FormGroup<EndpointForm>;
}
