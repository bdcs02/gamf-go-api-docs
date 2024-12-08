import { Generator } from '../generator';
import { faker } from '@faker-js/faker';

export class HttpMethodGenerator implements Generator {
	public generate(): string {
		return faker.internet.httpMethod();
	}

}
