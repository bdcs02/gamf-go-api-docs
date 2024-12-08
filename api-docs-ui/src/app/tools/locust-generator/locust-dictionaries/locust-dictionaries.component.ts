import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from 'src/app/utils/dialog/confirm-dialog.component';
import { DictionaryForm, WordForm } from '../generator-form';

@Component({
	selector: 'locust-dictionaries',
	templateUrl: './locust-dictionaries.component.html',
	styleUrl: './locust-dictionaries.component.scss'
})
export class LocustDictionariesComponent {
	@Input() public formArray!: FormArray<FormGroup<DictionaryForm>>;

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly translate: TranslateService,
		private readonly dialog: MatDialog
	) {}

	public dropDictionary(event: CdkDragDrop<string[]>): void {
		if (event.previousIndex !== event.currentIndex) {
			this.formArray.markAsDirty();
		}
		moveItemInArray(this.formArray.controls, event.previousIndex, event.currentIndex);
	}

	public addDictionary(name: string): void {
		if (name !== '') {
			this.formArray.markAsDirty();
			this.formArray.push(
				new FormGroup<DictionaryForm>({
					name: this.formBuilder.control(name, { nonNullable: true }),
					words: this.formBuilder.array<FormGroup<WordForm>>([])
				})
			);
		}
	}

	public addWord(id: number): void {
		this.formArray.markAsDirty();
		this.formArray.controls[id].controls.words.push(
			new FormGroup<WordForm>({
				word: this.formBuilder.control('', { nonNullable: true })
			})
		);
	}

	public deleteDictionary(id: number): void {
		this.dialog
			.open(ConfirmDialogComponent, {
				data: {
					componentName: 'LocustDictionaryComponent',
					title: this.translate.instant('locust.dictionaries.deleteTitle'),
					description: this.translate.instant('locust.dictionaries.deleteMessage', {
						dictionary: this.formArray.controls[id].controls.name.value
					})
				}
			})
			.afterClosed()
			.subscribe((result: any) => {
				if (result) {
					this.formArray.markAsDirty();
					this.formArray.removeAt(id);
				}
			});
	}

	public deleteWord(dictionaryId: number, wordId: number): void {
		this.dialog
			.open(ConfirmDialogComponent, {
				data: {
					componentName: 'LocustDictionaryComponent',
					title: this.translate.instant('locust.dictionaries.word.deleteTitle'),
					description: this.translate.instant('locust.dictionaries.word.deleteMessage', {
						word: this.formArray.controls[dictionaryId].controls.words.controls[wordId].controls.word.value
					})
				}
			})
			.afterClosed()
			.subscribe((result: any) => {
				if (result) {
					this.formArray.markAsDirty();
					this.formArray.controls[dictionaryId].controls.words.removeAt(wordId);
				}
			});
	}
}
