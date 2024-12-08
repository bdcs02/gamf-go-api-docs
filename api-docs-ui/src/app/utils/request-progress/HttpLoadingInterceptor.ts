import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RequestProgressService } from './request-progress.service';

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {

	constructor(private readonly service: RequestProgressService) { }

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		this.service.handleRequestStarted();

		return next.handle(request).pipe(finalize(() => {
			this.service.handleRequestFinished();
		}));
	}
}
