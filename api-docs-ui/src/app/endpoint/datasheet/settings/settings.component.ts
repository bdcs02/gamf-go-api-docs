/* eslint-disable @typescript-eslint/indent */
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SettingsForm } from '../endpoint-form';
import { LOCALES } from 'src/app/tools/locust-generator/locust-general/locales';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['settings.component.scss']
})
export class SettingsComponent {
  @Input() formGroup!: FormGroup<SettingsForm>;
  locales = LOCALES;
}
