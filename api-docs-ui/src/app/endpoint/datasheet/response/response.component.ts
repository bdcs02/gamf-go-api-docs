/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ContentTypes, Endpoint } from '../../api';
import { ExportFileService } from 'src/app/utils/export-file-service';
import { ThemeService } from 'src/app/utils/theme/theme.service';
import { saveAs } from 'file-saver';
import { BehaviorSubject } from 'rxjs';

@Component({
	selector: 'endpoint-response',
	templateUrl: 'response.component.html',
	styleUrls: ['response.component.scss']
})

export class ResponseComponent implements OnInit, OnChanges {

	@Input() public response!: BehaviorSubject<HttpResponse<any> | HttpErrorResponse | undefined>;
	@Input() public endpoint: Endpoint | undefined = undefined;
	@Input() public responseTime: any;
	public responseSize: any;
	public responseDate: any;
	public backgroundClass: string = 'http-unofficial';
	public date: string = '';
	public columnsToDisplay: string[] = ['headerName', 'value'];
	public imageBase64 = '';

	constructor(private readonly exportFileService: ExportFileService, private readonly theme: ThemeService) {
	}

	public ngOnInit(): void {
		this.response.subscribe(response => {
			if (response) {
				this.responseDate = response.headers.get('date');
				this.responseSize = response?.headers.get('content-length');
				this.getImage();
				this.changeColor();
			}
		});
	}

	public ngOnChanges(): void {
		this.response.subscribe(response => {
			if (response) {
				this.responseDate = response.headers.get('date');
				this.responseSize = response?.headers.get('content-length');
				this.getImage();
				this.changeColor();
			}
		});
	}

	public isContentType(type: string): boolean {
		if (!this.response.getValue()) {
			return false;
		}
		const contentType = this.response.getValue()?.headers.get('content-type');

		return contentType ? contentType.includes(type) : false;
	}

	public contentTypeHasPrefix(type: string): boolean {
		if (!this.response.getValue()) {
			return false;
		}

		const contentType = this.response.getValue()?.headers.get('content-type');

		if (contentType) {
			return contentType.startsWith(type);
		}

		return false;
	}

	public getResponseBody(): any {
		const body = this.response.getValue();
		if (!body) {
			return null;
		}

		if (body instanceof HttpErrorResponse) {
			return body.error;
		}

		if (body instanceof HttpResponse) {
			return body.body;
		}

		return null;
	}

	public get contentTypes(): typeof ContentTypes {
		return ContentTypes;
	}

	public downloadResponse(): void {
		if (!this.response.getValue()) {
			return;
		}

		const filename = this.endpoint!.method + '-' + this.endpoint!.path + '-' + new Date().toISOString().split('T')[0];
		const contentType: string = this.response.getValue()?.headers.get('Content-Type')
			? String(this.response.getValue()?.headers.get('Content-Type'))
			: 'application/text';
		const content = this.getResponseBody();
		const contentExpression = typeof content === 'object' ? JSON.stringify(content) : String(content);
		const bodyValue = content instanceof Blob ? content : contentExpression;
		const blob = new Blob([bodyValue], { type: contentType });
		saveAs(blob, filename);
	}

	public changeColor(): void {
		switch (this.response.getValue()?.status.toString()[0]) {
			case '1':
				this.backgroundClass = 'http-info';
				break;
			case '2':
				this.backgroundClass = 'http-success';
				break;
			case '3':
				this.backgroundClass = 'http-redirect';
				break;
			case '4':
			case '5':
				this.backgroundClass = 'http-client-server';
				break;
			default:
				this.backgroundClass = 'http-unofficial';
				break;
		}
	}

	public getImage(): void {
		if (this.contentTypeHasPrefix(this.contentTypes.IMAGE)) {
			const reader = new FileReader();
			reader.readAsDataURL(this.getResponseBody() as Blob);
			reader.onloadend = () => {
				this.imageBase64 = String(reader.result);
			};
		}
	}
}
