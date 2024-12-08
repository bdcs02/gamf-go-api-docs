import { Faker } from '@faker-js/faker';
import { Generator } from '../generator';
export class EmailGenerator implements Generator {

	private firstName: string | undefined;
	private lastName: string | undefined;
	private provider: string | undefined;
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
				if (item === 'provider') {
					this.provider = options.get(item);
				}
			}
		}
		this.faker = faker;
	}

	public generate(): string {
		return this.faker.internet.email({ firstName: this.firstName, lastName: this.lastName, provider: this.provider });
	}

}
