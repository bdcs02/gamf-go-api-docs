import { animate, animateChild, query, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestProgressService } from './request-progress.service';

@Component({
	selector: 'request-progress',
	templateUrl: 'request-progress.component.html',
	styleUrls: ['request-progress.component.scss'],
	animations: [
		trigger('fadeHolder', [
			transition('* => *', [
				query('@*', [animateChild()], { optional: true })
			])
		]),
		trigger('fade', [
			transition(':enter', [
				style({ opacity: 0, transform: 'scaleY(0)' }),
				animate('150ms ease-out', style({ opacity: 1, transform: 'scaleY(1)' })),
			]),
			transition(':leave', [
				style({ opacity: 1, transform: 'scaleY(1)' }),
				animate('150ms ease-out', style({ opacity: 0, transform: 'scaleY(0)' })),
			]),
		]),
	]
})
export class RequestProgressComponent implements OnDestroy {
	public isLoading = false;
	public subscription: Subscription;

	constructor(private readonly requestProgressService: RequestProgressService) {
		this.subscription = this.requestProgressService.stateChanged.subscribe(value => {
			if (this.isLoading !== value) {
				this.isLoading = value;
			}
		});
	}

	public ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}
}
