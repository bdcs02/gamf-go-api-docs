import { MaterialModule } from '../utils/material.module';
import { NotificationContainerComponent } from './notification-container/notification-container.component';
import { NotificationComponent } from './notification/notification.component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	imports: [CommonModule, MaterialModule, ReactiveFormsModule, TranslateModule],
	exports: [NotificationContainerComponent],
	declarations: [NotificationComponent, NotificationContainerComponent],
	providers: []
})
export class NotificationModule {}
