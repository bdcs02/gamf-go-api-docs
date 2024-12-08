import { FormFieldsModule } from '../utils/form-fields/form-fields.module';
import { MaterialModule } from '../utils/material.module';
import { AuthGuardService } from './auth-guard.service';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	imports: [CommonModule, MaterialModule, ReactiveFormsModule, TranslateModule, FormFieldsModule],
	exports: [],
	providers: [AuthGuardService]
})
export class AuthModule {}
