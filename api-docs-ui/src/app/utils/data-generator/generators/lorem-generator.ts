import { faker } from '@faker-js/faker';
import { Generator } from '../generator';
import { GeneratorBase } from '../generator-base';

export class LoremGenerator extends GeneratorBase implements Generator {

	constructor(options: Map<string, any>) {
		super(1, 5);
		super.getOptionsMinMax(options);
	}

	public generate(): string {
		return faker.lorem.lines({ min: this.getMin(), max: this.getMax() });
	}
}
