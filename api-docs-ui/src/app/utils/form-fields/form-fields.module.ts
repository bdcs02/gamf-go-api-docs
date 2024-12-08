import { MaterialModule } from '../material.module';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DropdownListComponent } from './dropdown-list/dropdown-list.component';
import { FormErrorsComponent } from './form-errors/form-errors.component';
import { MultipleSelectComponent } from './multiple-select/multiple-select.component';
import { NumberInputComponent } from './number-input/number-input.component';
import { PasswordInputComponent } from './password-input/password-input.component';
import { SelectionListComponent } from './selection-list/selection-list.component';
import { TextInputComponent } from './text-input/text-input.component';
import { TextareaInputComponent } from './textarea-input/textarea-input.component';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	declarations: [
		DatePickerComponent,
		DropdownListComponent,
		FormErrorsComponent,
		NumberInputComponent,
		MultipleSelectComponent,
		PasswordInputComponent,
		SelectionListComponent,
		TextareaInputComponent,
		TextInputComponent
	],
	exports: [
		DatePickerComponent,
		DropdownListComponent,
		FormErrorsComponent,
		NumberInputComponent,
		MultipleSelectComponent,
		PasswordInputComponent,
		SelectionListComponent,
		TextareaInputComponent,
		TextInputComponent
	],
	imports: [BrowserAnimationsModule, BrowserModule, FormsModule, MaterialModule, TranslateModule, ReactiveFormsModule]
})
export class FormFieldsModule {}
