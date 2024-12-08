import { NotificationService } from '../notification.service';

import { animate, animateChild, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
	selector: 'notification-container',
	templateUrl: 'notification-container.component.html',
	styleUrls: ['notification-container.component.scss'],
	animations: [
		trigger('slipInOutHolder', [
			transition('* => *', [
				query(':enter', stagger(25, animateChild()), { optional: true }),
				query(':leave', stagger(25, animateChild()), { optional: true })
			])
		]),
		trigger('slipInOut', [
			transition(':enter', [
				style({ opacity: 0, transform: 'translateX(100%)' }),
				animate('175ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
			]),
			transition(':leave', [
				style({ opacity: 1, transform: 'translateX(0)' }),
				animate('125ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
			])
		])
	]
})
export class NotificationContainerComponent {
	constructor(public readonly service: NotificationService) {}
}
