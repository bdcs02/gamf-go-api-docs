import { Generator } from '../generator';
import { faker } from '@faker-js/faker';
import { GeneratorBase } from '../generator-base';

export class StringGenerator extends GeneratorBase implements Generator {
	constructor(options: Map<string, any>) {
		super(0, 100);
		super.getOptionsMinMax(options);
	}

	public generate(): string {
		const randomString = faker.string.alpha({ length: { min: this.getMin(), max: this.getMax() } });
		return randomString;
	}
}
