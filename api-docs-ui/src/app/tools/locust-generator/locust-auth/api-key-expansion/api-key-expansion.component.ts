import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiKeyForm } from '../../generator-form';

@Component({
	selector: 'api-key-expansion',
	templateUrl: './api-key-expansion.component.html',
	styleUrl: './api-key-expansion.component.scss'
})
export class ApiKeyExpansionComponent {
	@Input() public formGroup!: FormGroup<ApiKeyForm>;
}
