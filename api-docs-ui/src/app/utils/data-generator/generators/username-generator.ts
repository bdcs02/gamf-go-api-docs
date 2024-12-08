import { Generator } from '../generator';
import { Faker } from '@faker-js/faker';

export class UsernameGenerator implements Generator {
	private firstName: string | undefined;
	private lastName: string | undefined;

	private faker: Faker;

	constructor(options: Map<string, any>, faker: Faker) {
		if (typeof options == 'object') {
			for (const item of options.keys()) {
				if (item === 'firstName') {
					this.firstName = options.get(item);
				}
				if (item === 'lastName') {
					this.lastName = options.get(item);
				}
			}
		}
		this.faker = faker;
	}

	public generate(): string {
		return this.faker.internet.userName({ firstName: this.firstName, lastName: this.lastName });
	}

}
