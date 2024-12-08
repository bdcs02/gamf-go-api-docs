import { ClickStopPropagationDirective } from './stop-propagation.directive';

import { NgModule } from '@angular/core';
import { PhoneNumberDirective } from 'src/app/utils/directives/phone-number';
import { WhitespaceValidator } from 'src/app/utils/directives/whitespace-validator';

@NgModule({
	imports: [],
	declarations: [PhoneNumberDirective, WhitespaceValidator, ClickStopPropagationDirective],
	exports: [PhoneNumberDirective, WhitespaceValidator, ClickStopPropagationDirective],
	providers: []
})
export class DirectiveModule {}
