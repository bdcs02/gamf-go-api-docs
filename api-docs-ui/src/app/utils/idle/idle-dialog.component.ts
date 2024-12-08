import { IdleWatcherService } from './idle-watcher.service';

import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
	selector: 'idle-dialog',
	templateUrl: 'idle-dialog.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['idle-dialog.component.scss']
})
export class IdleDialogComponent implements OnDestroy {
	public progress = 100;
	public timeLeft;

	private interval: Subscription;

	constructor(private readonly idleService: IdleWatcherService) {
		const timeutSeconds = this.idleService.alertedIntervalSeconds;
		this.timeLeft = timeutSeconds;
		let seconds = 0;
		this.interval = timer(0, 1000).subscribe(() => {
			this.tick(timeutSeconds, seconds);
			if (++seconds === timeutSeconds) {
				this.interval.unsubscribe();
			}
		});
	}

	public ngOnDestroy(): void {
		this.interval.unsubscribe();
	}

	private tick(timeutSeconds: number, seconds: number): void {
		this.timeLeft = timeutSeconds - seconds;
		this.progress = 100 - Math.floor((seconds / (timeutSeconds - 1)) * 100);
	}
}
