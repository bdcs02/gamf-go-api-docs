/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, Input } from '@angular/core';
import { ThemeService } from 'src/app/utils/theme/theme.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RequestBodyForm } from 'src/app/endpoint/datasheet/endpoint-form';

@Component({
	selector: 'monaco-editor',
	templateUrl: './monaco-editor.component.html',
	styleUrl: './monaco-editor.component.scss'
})
export class MonacoEditorComponent implements OnInit {
	@Input() content!: string;
	@Input() language!: string;
	@Input() formControllName = '';
	@Input() formGroup!: FormGroup<RequestBodyForm>;
	@Input() jsonData?: any;
	public editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {};

	constructor(private readonly theme: ThemeService, private readonly formBuilder: FormBuilder) {}

	public ngOnInit(): void {
		if(this.jsonData) {
			this.formGroup = new FormGroup<any>({
				bodyString: this.formBuilder.control('')
			});
			this.formGroup.controls.bodyString.patchValue(JSON.stringify(this.jsonData, null, '\t'));
		}

		this.editorOptions = {
			language: this.language,
			wordWrap: 'on',
			autoIndent: 'full',
			formatOnPaste: true,
			formatOnType: true,
			theme: `vs-${this.theme.currentTheme.getValue()}`
		};
		this.subscribeToCurrentTheme(this.theme.currentTheme.getValue());
	}

	public subscribeToCurrentTheme(theme: string): void {
		this.theme.currentTheme.subscribe(value => {
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && theme === 'auto') {
				this.editorOptions = { ...this.editorOptions, theme: 'vs-dark' };
			} else {
				this.editorOptions = { ...this.editorOptions, theme: `vs-${value}` };
			}
		});
	}
}
