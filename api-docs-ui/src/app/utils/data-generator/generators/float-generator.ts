import { faker } from '@faker-js/faker';
import { Generator } from '../generator';
import { GeneratorBase } from '../generator-base';

export class FloatGenerator extends GeneratorBase implements Generator {
	constructor(options: Map<string, any>) {
		super(0, 10000);
		if (typeof options === 'object') {
			for (const item of options.keys()) {
				if (item === 'min') {
					this.setMin(Number.parseFloat(options.get(item)));
				}
				if (item === 'max') {
					this.setMax(Number.parseFloat(options.get(item)));
				}
			}
		}
	}

	public generate(): string {
		return faker.number.float({ min: this.getMin(), max: this.getMax() }).toString();
	}
}
