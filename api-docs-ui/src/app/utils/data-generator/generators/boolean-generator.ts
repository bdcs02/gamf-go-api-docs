import { Generator } from '../generator';
import { faker } from '@faker-js/faker';

export class BooleanGenerator implements Generator {
	public generate(): string {
		return faker.datatype.boolean() ? 'true' : 'false';
	}

}
