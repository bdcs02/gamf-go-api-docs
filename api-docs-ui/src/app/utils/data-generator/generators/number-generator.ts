import { faker } from '@faker-js/faker';
import { Generator } from '../generator';
import { GeneratorBase } from '../generator-base';

export class NumberGenerator extends GeneratorBase implements Generator {


	constructor(options: Map<string, any>) {
		super(0, 10000);
		super.getOptionsMinMax(options);
	}

	public generate(): string {
		const randomNumber = faker.number.int({ min: this.getMin(), max: this.getMax() }).toString();
		return randomNumber;
	}
}
