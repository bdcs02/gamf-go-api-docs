import { AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

interface MenuButtons {
	name: string;
	disabled: boolean;
	clickEvent: CallableFunction;
}

@Component({
	selector: 'button-frame',
	templateUrl: 'button-frame.component.html',
	styleUrls: ['button-frame.component.scss']
})
export class ButtonFrameComponent implements OnInit, AfterViewInit, OnDestroy {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	@ViewChild('buttonFrame') buttonFrame!: any;
	@Input() icon = 'menu';
	public menuButtons: MenuButtons[] = [];
	public screenWidth = 0;

	private mouseDownSubscription: Subscription;

	constructor() {
		this.mouseDownSubscription = fromEvent(document, 'mousedown').subscribe(() => this.detectDisabled());
	}

	@HostListener('window:resize')
	public onResize(): void {
		this.screenWidth = window.innerWidth;
	}

	public ngOnInit(): void {
		this.screenWidth = window.innerWidth;
	}

	public ngAfterViewInit(): void {
		setTimeout(() => this.addMenuButtons());
	}

	public onContentChange(): void {
		this.menuButtons = [];
		this.addMenuButtons();
	}

	public ngOnDestroy(): void {
		this.mouseDownSubscription?.unsubscribe();
	}


	private addMenuButtons(): void {
		const innerButtons = this.buttonFrame?.nativeElement?.childNodes;
		for (const button of innerButtons) {
			if (button.localName !== 'button') {
				continue;
			}
			this.menuButtons.push({
				name: button.ariaLabel ? button.ariaLabel : button.innerText,
				clickEvent: button.click.bind(button),
				disabled: button.disabled
			});
		}
	}

	private detectDisabled(): void {
		const innerButtons = this.buttonFrame?.nativeElement?.childNodes;
		let frameIterator = 0;
		let menuButtonIterator = 0;
		while (frameIterator < innerButtons.length) {
			if (innerButtons[frameIterator].localName !== 'button') {
				++frameIterator;
				continue;
			}
			const menuButton = this.menuButtons[menuButtonIterator];
			if (menuButton) {
				menuButton.disabled = innerButtons[frameIterator].disabled;
			}
			++menuButtonIterator;
			++frameIterator;
		}
	}
}
