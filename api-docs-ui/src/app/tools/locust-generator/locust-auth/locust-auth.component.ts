import { Component, Input } from '@angular/core';
import { ApiKeyForm, ApiKeyPosition, AuthTypes, AuthorizationForm, BearerForm, OAuthForm } from '../generator-form';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ConfirmDialogComponent } from 'src/app/utils/dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'locust-auth',
	templateUrl: './locust-auth.component.html',
	styleUrl: './locust-auth.component.scss'
})
export class LocustAuthComponent {
	@Input() public formArray!: FormArray<FormGroup<AuthorizationForm>>;
	public authTypes: string[] = ['OAuth', 'Bearer Token', 'Api key'];

	public get authType(): typeof AuthTypes {
		return AuthTypes;
	}

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly translate: TranslateService,
		private readonly dialog: MatDialog
	) {}

	public dropAuth(event: CdkDragDrop<string[]>): void {
		if (event.previousIndex !== event.currentIndex) {
			this.formArray.markAsDirty();
		}
		moveItemInArray(this.formArray.controls, event.previousIndex, event.currentIndex);
	}

	public addAuth(name: string, type: string): void {
		if (name !== '' && type !== undefined && type !== null) {
			this.formArray.markAsDirty();
			this.formArray.push(
				new FormGroup<AuthorizationForm>({
					name: this.formBuilder.control(name, { nonNullable: true }),
					type: this.formBuilder.control(type as unknown as AuthTypes, { nonNullable: true }),
					oAuth: new FormGroup<OAuthForm>({
						url: this.formBuilder.control('', { nonNullable: true }),
						clientID: this.formBuilder.control('', { nonNullable: true }),
						grantType: this.formBuilder.control('password', { nonNullable: true }),
						responseType: this.formBuilder.control('code', { nonNullable: true }),
						username: this.formBuilder.control('', { nonNullable: true }),
						password: this.formBuilder.control('', { nonNullable: true })
					}),
					bearerToken: new FormGroup<BearerForm>({
						token: this.formBuilder.control('', { nonNullable: true })
					}),
					apiKey: new FormGroup<ApiKeyForm>({
						key: this.formBuilder.control('', { nonNullable: true }),
						value: this.formBuilder.control('', { nonNullable: true }),
						position: this.formBuilder.control(ApiKeyPosition.Header, { nonNullable: true })
					})
				})
			);
		}
	}

	public deleteAuth(id: number): void {
		this.dialog
			.open(ConfirmDialogComponent, {
				data: {
					componentName: 'LocustAuthComponent',
					title: this.translate.instant('locust.auth.deleteTitle'),
					description: this.translate.instant('locust.auth.deleteMessage', { auth: this.formArray.controls[id].value.name! })
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
}
