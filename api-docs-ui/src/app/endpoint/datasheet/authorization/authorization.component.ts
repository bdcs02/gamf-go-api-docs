/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ApiService } from 'src/app/endpoint/api.service';
import { AuthorizationForm } from '../endpoint-form';

export type authorizationType = 'Nincs' | 'Bearer Token' | 'API Key' | 'Keycloak';

@Component({
	selector: 'authorization',
	templateUrl: './authorization.component.html',
	styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {
	@Input() formGroup!: FormGroup<AuthorizationForm>;
	public authorizationTypes: authorizationType[] = ['Nincs', 'Bearer Token', 'API Key'];

	constructor(private readonly apiService: ApiService) { }

	public ngOnInit(): void {
		this.apiService.getApiData().subscribe(response => {
			if (response.keycloak) {
				this.authorizationTypes = [...this.authorizationTypes, 'Keycloak'];
			}
		});
	}

	public selectAuthorizationType(event: MatSelectChange): void {
		this.formGroup.controls.type.patchValue(event.value);
	}
}
