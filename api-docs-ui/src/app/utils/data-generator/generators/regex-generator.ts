import { faker } from '@faker-js/faker';
import { Generator } from '../generator';

export class RegexGenerator implements Generator {
	private readonly pattern: string = '';

	constructor(pattern: Map<string, any>) {
		this.pattern = pattern.get('pattern');
	}
	public generate(): string {
		return faker.helpers.fromRegExp(this.pattern);
	}
}
