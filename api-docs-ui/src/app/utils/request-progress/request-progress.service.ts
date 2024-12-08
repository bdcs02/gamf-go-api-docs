import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class RequestProgressService {
	public stateChanged = new EventEmitter<boolean>();

	private delay = 500;	// delay in ms
	private isLoading = new Subject<boolean>();

	private concurrentRequests = 0;

	constructor() {
		this.isLoading.pipe(debounceTime(this.delay)).subscribe(value => {
			this.stateChanged.emit(value);
		});
	}

	public handleRequestStarted(): void {
		this.concurrentRequests++;
		this.isLoading.next(true);
	}

	public handleRequestFinished(): void {
		this.concurrentRequests--;

		if (this.concurrentRequests === 0) {
			this.isLoading.next(false);
		}
	}
}
