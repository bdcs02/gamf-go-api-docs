/* eslint-disable arrow-parens */
import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { GeneratorForm, LocustEndpointForm, ModulForm } from '../generator-form';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LocustModulAddDialogComponent } from './locust-modul-add-dialog/locust-modul-add-dialog.component';
import { ProjectGeneratorService } from '../project-generator.service';
import { LocustGeneratedModulComponent } from './locust-generated-modul/locust-generated-modul.component';
import { ConfirmDialogComponent } from 'src/app/utils/dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';

export interface Task {
	enabled: boolean;
	subtasks?: Task[];
}

@Component({
	selector: 'locust-moduls',
	templateUrl: './locust-moduls.component.html',
	styleUrl: './locust-moduls.component.scss'
})
export class LocustModulsComponent implements OnInit {
	@Input() public generatorForm!: FormGroup<GeneratorForm>;
	public modulFormArray!: FormArray<FormGroup<ModulForm>>;
	public activeModul!: FormGroup<ModulForm> | undefined;

	readonly task = signal<Task>({
		enabled: false,
		subtasks: []
	});

	readonly partiallyComplete = computed(() => {
		const task = this.task();
		if (!task.subtasks) {
			return false;
		}
		return task.subtasks.some((t) => t.enabled) && !task.subtasks.every((t) => t.enabled);
	});

	constructor(
		public readonly dialog: MatDialog,
		private readonly formBuilder: FormBuilder,
		private readonly projectGenerator: ProjectGeneratorService,
		private readonly translate: TranslateService
	) {}

	public update(enabled: boolean, index?: number): void {
		this.task.update((task) => {
			if (index === undefined) {
				task.enabled = enabled;
				task.subtasks!.forEach((t) => (t.enabled = enabled));
				this.modulFormArray.value.forEach((t) => (t.enabled = enabled));
			} else {
				this.modulFormArray.value[index].enabled = enabled;
				task.subtasks![index].enabled = enabled;
				task.enabled = this.modulFormArray.value.every((t) => t.enabled) ?? true;
			}
			return { ...task };
		});
	}

	public ngOnInit(): void {
		this.modulFormArray = this.generatorForm.controls.modul;
		if (this.modulFormArray.length > 0) {
			this.activeModul = this.modulFormArray.controls[0];
			this.modulFormArray.value.forEach((modul) => this.task().subtasks!.push({ enabled: modul.enabled! }));
			this.task().enabled = this.modulFormArray.value.every((t) => t.enabled) ?? true;
		}
	}

	public dropModul(event: CdkDragDrop<string[]>): void {
		if (event.previousIndex !== event.currentIndex) {
			this.modulFormArray.markAsDirty();
		}
		moveItemInArray(this.modulFormArray.controls, event.previousIndex, event.currentIndex);
	}

	public addModul(): void {
		const dialogRef = this.dialog.open(LocustModulAddDialogComponent, {
			data: {
				isUpdate: false
			}
		});

		dialogRef.afterClosed().subscribe((result: string | undefined) => {
			if (result) {
				this.modulFormArray.markAsDirty();
				this.modulFormArray.push(
					new FormGroup<ModulForm>({
						enabled: this.formBuilder.control(true, { nonNullable: true }),
						id: this.formBuilder.control(0, { nonNullable: true }),
						name: this.formBuilder.control(result, { nonNullable: true }),
						endpoints: this.formBuilder.array<FormGroup<LocustEndpointForm>>([])
					})
				);
			}
		});
	}

	public deleteModul(event: MouseEvent, id: number): void {
		event.preventDefault();
		event.stopPropagation();
		this.dialog
			.open(ConfirmDialogComponent, {
				data: {
					componentName: 'LocustModulResponseComponent',
					title: this.translate.instant('locust.modul.deleteTitle'),
					description: this.translate.instant('locust.modul.deleteMessage', { modul: this.modulFormArray.controls[id].value.name! })
				}
			})
			.afterClosed()
			.subscribe((result: any) => {
				if (result) {
					if (this.activeModul === this.modulFormArray.controls[id] && this.modulFormArray.controls.length > 0) {
						this.activeModul = this.modulFormArray.controls[0];
					} else {
						this.activeModul = undefined;
					}
					this.modulFormArray.markAsDirty();
					this.modulFormArray.removeAt(id);
				}
			});
	}

	public generateModul(event: MouseEvent, id: number): void {
		event.preventDefault();
		event.stopPropagation();
		this.dialog.open(LocustGeneratedModulComponent, {
			data: {
				generated: this.projectGenerator.generateModul(this.modulFormArray.controls[id], this.generatorForm)
			}
		});
	}

	public setActiveModul(modul: any): void {
		this.activeModul = modul;
	}
}
