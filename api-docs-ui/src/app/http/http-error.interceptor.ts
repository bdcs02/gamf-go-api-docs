import { catchError, Observable, throwError } from 'rxjs';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthGuardService } from '../auth/auth-guard.service';
import { withoutDialogHeader } from './without-dialog';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
	private textDecoder = new TextDecoder('utf-8');

	constructor(private readonly authService: AuthGuardService) { }

	public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		req = req.clone({
			headers: req.headers.delete(withoutDialogHeader)
		});
		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => throwError(error))
		);
	}
}
