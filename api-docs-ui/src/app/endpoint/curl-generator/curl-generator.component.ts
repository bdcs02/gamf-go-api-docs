import { Component, Input, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurlGenerator } from 'curl-generator';
import { Clipboard } from '@angular/cdk/clipboard';
import { CurlAssembler } from '../datasheet/curl-assembler';
import { Endpoint } from '../api';
import { FormGroup } from '@angular/forms';
import { EndpointForm } from '../datasheet/endpoint-form';
import { ApiService } from '../api.service';
import { DatabaseService } from 'src/app/database/database.service';

export interface CurlGeneratorComponentOptions {
	config: FormGroup<EndpointForm>;
	api: ApiService;
	endpoint: Endpoint;
}

@Component({
	selector: 'app-curl-generator',
	templateUrl: './curl-generator.component.html',
	styleUrl: './curl-generator.component.scss'
})
export class CurlGeneratorComponent implements OnInit {
	@Input() curl: string = '';
	public curlSnippet: string = '';
	private curlAssembler: CurlAssembler;

	constructor(
		@Inject(MAT_DIALOG_DATA) public readonly data: CurlGeneratorComponentOptions,
		private readonly clipboard: Clipboard,
		private readonly apiService: ApiService,
		private readonly db: DatabaseService
	) {
		this.curlAssembler = new CurlAssembler(this.data.config, this.data.api, db);
	}

	public async ngOnInit(): Promise<void> {
		this.curlSnippet = CurlGenerator(await this.curlAssembler.genCurl(this.data.endpoint));
	}

	public copyKey(text: string): void {
		this.clipboard.copy(text);
	}
}
