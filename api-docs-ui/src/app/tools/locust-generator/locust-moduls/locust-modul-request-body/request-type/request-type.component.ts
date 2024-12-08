/* eslint-disable arrow-parens */
import { Component, Input, OnInit } from '@angular/core';
import { DictionaryForm, FakerTypeForm, TypeForm, TypeFormTypes } from '../../../generator-form';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FakerType, fakerList } from './faker-types';
import { RandomType, randomList } from './random-types';

@Component({
	selector: 'request-type',
	templateUrl: './request-type.component.html',
	styleUrl: './request-type.component.scss'
})
export class RequestTypeComponent implements OnInit {
	@Input() typeForm!: FormGroup<TypeForm>;
	@Input() public fieldId!: number;
	@Input() public structs!: string[];
	@Input() customTypes!: string[];
	@Input() public dictionaries!: FormArray<FormGroup<DictionaryForm>>;
	public types: string[] = ['Null', 'Szöveg', 'Szám', 'Logikai típus', 'Faker', 'Random'];
	public fakers: FakerType[] = fakerList;
	public randoms: RandomType[] = randomList;

	public get typeFormTypes(): typeof TypeFormTypes {
		return TypeFormTypes;
	}

	constructor(private readonly formBuilder: FormBuilder) {}

	public getFaker(): FakerType {
		return this.fakers.find((faker) => faker.method === this.typeForm.controls.fakerValue.value)!;
	}

	public ngOnInit(): void {
		if (this.typeForm.controls.fakerType.controls.length === 0) {
			this.update();
		}
	}

	public update(): void {
		const fakerType = this.getFaker();
		if (fakerType) {
			this.typeForm.controls.fakerType.clear();
			if (fakerType.options) {
				for (const option of fakerType.options) {
					this.typeForm.controls.fakerType.push(
						new FormGroup<FakerTypeForm>({
							name: this.formBuilder.control(option.name, { nonNullable: true }),
							value: this.formBuilder.control('', { nonNullable: true })
						})
					);
				}
			}
		}
	}
}
