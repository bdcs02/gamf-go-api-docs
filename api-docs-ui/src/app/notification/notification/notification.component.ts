import { NotificationService } from '../notification.service';
import { Notification } from '../notification.types';

import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'notification',
	templateUrl: 'notification.component.html',
	styleUrls: ['notification.component.scss'],
	animations: [
		trigger('progressBar', [
			transition(':enter', [style({ width: 0, opacity: 0 }), animate('150ms ease-out', style({ width: '*', opacity: 1 }))]),
			transition(':leave', [style({ width: '*', opacity: 1 }), animate('150ms ease-in', style({ width: 0, opacity: 0 }))])
		])
	]
})
export class NotificationComponent implements OnInit {
	@Input() notification!: Notification;

	public notificationHideDelay = 8000;

	public stopped = false;

	constructor(private readonly service: NotificationService) {}

	public ngOnInit(): void {
		setTimeout(() => {
			if (!this.stopped) {
				this.service.delete(this.notification);
			}
		}, this.notificationHideDelay);
	}

	public notificationClick(): void {
		this.service.delete(this.notification);
	}

	public remove(): void {
		this.service.delete(this.notification);
	}
}
