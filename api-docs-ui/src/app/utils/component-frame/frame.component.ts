import { Component, Input } from '@angular/core';

@Component({
	selector: 'component-frame',
	templateUrl: 'frame.component.html',
	styleUrls: ['frame.component.scss']
})
export class FrameComponent {
	@Input() title: string | undefined = '';
	@Input() chip: string | undefined = undefined;
	@Input() backButtonVisible = false;

	public navigateBack(): void {
		history.back();
	}
}
