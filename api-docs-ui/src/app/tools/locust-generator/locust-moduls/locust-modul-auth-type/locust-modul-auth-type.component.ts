/* eslint-disable arrow-parens */
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GeneratorForm, LocustEndpointForm } from '../../generator-form';

@Component({
	selector: 'locust-modul-auth-type',
	templateUrl: './locust-modul-auth-type.component.html',
	styleUrl: './locust-modul-auth-type.component.scss'
})
export class LocustModulAuthTypeComponent {
	@Input() endpointForm!: FormGroup<LocustEndpointForm>;
	@Input() generatorForm!: FormGroup<GeneratorForm>;
}
