import { IdleDialogComponent } from './idle-dialog.component';

import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fromEvent, merge, Observable, Subject, Subscription, timer } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class IdleWatcherService {
	public alertVisible = false;
	public readonly alertedIntervalSeconds = 60;
	public readonly timeOutSeconds = 900;
	public expired: Subject<boolean> = new Subject<boolean>();

	private idle!: Observable<unknown>;
	private timer!: Subscription;
	private idleSubscription!: Subscription;
	private idleDialog?: MatDialogRef<IdleDialogComponent, unknown>;

	constructor(private readonly dialog: MatDialog) { }

	public startWatching(): Observable<unknown> {
		this.idle = merge(
			fromEvent(document, 'mousemove'),
			fromEvent(document, 'click'),
			fromEvent(document, 'mousedown'),
			fromEvent(document, 'keypress'),
			fromEvent(document, 'DOMMouseScroll'),
			fromEvent(document, 'mousewheel'),
			fromEvent(document, 'touchmove'),
			fromEvent(document, 'MSPointerMove'),
			fromEvent(window, 'mousemove'),
			fromEvent(window, 'resize')
		);

		this.idleSubscription = this.idle.subscribe(() => {
			this.resetTimer();
			this.alertVisible = false;
			this.idleDialog?.close();
		});

		this.startTimer();

		return this.expired;
	}

	public resetTimer(): void {
		this.timer.unsubscribe();
		this.startTimer();
	}

	public stopTimer(): void {
		this.timer?.unsubscribe();
		this.idleSubscription?.unsubscribe();
	}

	private startTimer(): void {
		const timeInMs = (this.alertVisible ? this.alertedIntervalSeconds : this.timeOutSeconds) * 1000;
		this.timer = timer(timeInMs, timeInMs).subscribe(() => {
			if (!this.alertVisible) {
				this.alertVisible = true;
				this.idleDialog = this.dialog.open(IdleDialogComponent);
				this.stopTimer();
				this.startWatching();
			} else {
				this.idleDialog?.close();
				this.expired.next(true);
			}
		});
	}

}
