import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';
import { saveAs } from 'file-saver';
import { first } from 'rxjs';

// This class is used to download csv export files.
@Injectable({
	providedIn: 'root'
})
export class ExportFileService {
	constructor(private readonly httpClient: HttpClient) { }

	/**
	 * Downloads export file based on Api url.
	 * Gets filename from 'Content-Disposition' header, then decodes the base64 response body and downloads it.
	 *
	 * @param url The Api url which should be called.
	 */
	public downloadFileGet(url: string): void {
		this.httpClient
			.get(url, {
				observe: 'response',
				responseType: 'arraybuffer'
			})
			.pipe(first())
			.subscribe(async response => {
				const contentDisposition = response.headers.get('Content-Disposition');
				if (response.body) {
					const filename = contentDisposition?.split(';')[1].split('=')[1].replace(/"/g, '');
					const blob = new Blob([response.body], { type: 'text/csv' });

					await blob.text().then(fileContent => {
						const fileDataProcessed = Buffer.from(fileContent, 'base64').toString('utf8');
						const decodedFile = new Blob([fileDataProcessed], { type: 'text/csv' });
						saveAs(decodedFile, filename);
					});
				}
			});
	}

	/**
	 * Downloads export file based on Api url and request body.
	 * Gets filename from 'Content-Disposition' header, then decodes the base64 response body and downloads it.
	 *
	 * @param url The Api url which should be called.
	 * @param body The request body.
	 */
	public downloadFilePost(url: string, body: unknown): void {
		this.httpClient
			.post(url, body, {
				observe: 'response',
				responseType: 'arraybuffer'
			})
			.pipe(first())
			.subscribe(async response => {
				const contentDisposition = response.headers.get('Content-Disposition');
				if (response.body) {
					const filename = contentDisposition?.split(';')[1].split('=')[1].replace(/"/g, '');
					const blob = new Blob([response.body], { type: 'text/csv' });

					await blob.text().then(fileContent => {
						const fileDataProcessed = Buffer.from(fileContent, 'base64').toString('utf8');
						const decodedFile = new Blob([fileDataProcessed], { type: 'text/csv' });
						saveAs(decodedFile, filename);
					});
				}
			});
	}

	public downloadResponseBody(url: string): void {
		this.httpClient
			.get(url, {
				observe: 'response',
				responseType: 'arraybuffer'
			})
			.pipe(first())
			.subscribe(response => {
				const contentDisposition = response.headers.get('Content-Disposition');
				if (response.body) {
					const filename = contentDisposition?.split(';')[1].split('=')[1].replace(/"/g, '');
					const blob = new Blob([response.body], { type: response.headers.get('Content-Type')! });
					saveAs(blob, filename);
				}
			});
	}
}
