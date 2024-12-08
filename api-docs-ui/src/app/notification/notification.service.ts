import { Notification } from './notification.types';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
	public notifications: Notification[] = [];

	public create(notification: Notification): void {
		this.notifications.push(notification);
	}

	public delete(notification: Notification): void {
		this.notifications.splice(this.notifications.indexOf(notification), 1);
	}
}
