import { MaterialModule } from '../material.module';
import { DialogFrameComponent } from './dialog-frame/dialog-frame.component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	imports: [MaterialModule, TranslateModule.forChild(), CommonModule],
	exports: [DialogFrameComponent],
	declarations: [DialogFrameComponent],
	providers: []
})
export class FrameModule {}
