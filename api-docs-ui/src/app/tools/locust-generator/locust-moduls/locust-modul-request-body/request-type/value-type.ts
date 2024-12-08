import { fakerList } from './faker-types';
export interface ValueType {
	name: string;
	formControl: string;
	displayKey?: string;
	valueKey?: string;
	values?: any[];
}

export interface Type {
	type: string;
	inputs: Input[];
}

export interface Input {
	inputType: string;
	values?: ValueType[];
}

export const commonTypes: ValueType[] = [
	{ name: 'Null', formControl: 'value' },
	{ name: 'Szöveg', formControl: 'value' },
	{ name: 'Szám', formControl: 'value' },
	{ name: 'Logikai típus', formControl: 'value', values: ['True', 'False'] },
	{ name: 'Faker', formControl: 'fakerValue', values: fakerList, displayKey: 'name', valueKey: 'method' },
	{ name: 'Random', formControl: 'value', values: ['Szótár'] }
];

export const types: Type[] = [
	{
		type: 'common',
		inputs: [{ inputType: 'Dropdown', values: commonTypes }]
	},
	{
		type: 'slice',
		inputs: [{ inputType: 'Dropdown', values: commonTypes }, { inputType: 'InputField' }]
	}
];
