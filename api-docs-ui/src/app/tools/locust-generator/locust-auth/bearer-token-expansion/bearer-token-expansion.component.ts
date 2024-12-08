import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BearerForm } from '../../generator-form';

@Component({
	selector: 'bearer-token-expansion',
	templateUrl: './bearer-token-expansion.component.html',
	styleUrl: './bearer-token-expansion.component.scss'
})
export class BearerTokenExpansionComponent {
	@Input() public formGroup!: FormGroup<BearerForm>;
}
