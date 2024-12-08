import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GeneralForm } from '../generator-form';
import { LOCALES } from './locales';

@Component({
	selector: 'locust-general',
	templateUrl: './locust-general.component.html',
	styleUrl: './locust-general.component.scss'
})
export class LocustGeneralComponent {
	@Input() public formGroup!: FormGroup<GeneralForm>;
	logLevels = ['INFO', 'WARNING', 'ERROR'];
	locales = LOCALES;
}
