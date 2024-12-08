/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonEditorOptions } from 'ang-jsoneditor';
import { ContentTypes, Endpoint } from 'src/app/endpoint/api';

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RequestBodyForm } from '../endpoint-form';

export type requestBodyType = 'Nincs' | 'JSON' | 'Szöveg' | 'Form Data';

@Component({
	selector: 'request-editor',
	templateUrl: 'request-editor.component.html',
	styleUrls: ['request-editor.component.scss']
})
export class RequestEditorComponent implements OnInit {
	@Input() public endpoint: Endpoint | undefined = undefined;
	@Input() public formGroup!: FormGroup<RequestBodyForm>;
	public requestBodyTypes: requestBodyType[] = ['Nincs', 'JSON', 'Szöveg', 'Form Data'];
	public editorOptions: JsonEditorOptions;

	constructor(private readonly formBuilder: FormBuilder) {
		this.editorOptions = new JsonEditorOptions();
		this.editorOptions.mainMenuBar = true;
		this.editorOptions.mode = 'code';
		this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
	}

	public ngOnInit(): void {
		this.formGroup.controls.type = this.formBuilder.control('Nincs', { nonNullable: true });
		if (this.endpoint?.contentType) {
			if (this.endpoint.contentType === ContentTypes.TEXT) {
				this.formGroup.controls.type = this.formBuilder.control('Szöveg', { nonNullable: true });
			} else if (this.endpoint.contentType === ContentTypes.JSON || this.endpoint.contentType === ContentTypes.XML) {
				this.formGroup.controls.type = this.formBuilder.control('JSON', { nonNullable: true });
			}
			else if (this.endpoint.contentType === ContentTypes.FORM_DATA) {
				this.formGroup.controls.type = this.formBuilder.control('Form Data', { nonNullable: true });
			}
		}
	}
}
