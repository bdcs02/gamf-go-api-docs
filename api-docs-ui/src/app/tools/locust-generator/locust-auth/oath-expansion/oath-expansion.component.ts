import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OAuthForm } from '../../generator-form';

@Component({
	selector: 'oath-expansion',
	templateUrl: './oath-expansion.component.html',
	styleUrl: './oath-expansion.component.scss'
})
export class OathExpansionComponent {
	@Input() public formGroup!: FormGroup<OAuthForm>;
}
