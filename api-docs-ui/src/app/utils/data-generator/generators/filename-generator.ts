import { Generator } from '../generator';
import { Faker } from '@faker-js/faker';

export class FilenameGenerator implements Generator {

	private readonly extension: string = '';
	private faker: Faker;

	constructor(options: Map<string, any>, faker: Faker) {

		if (typeof options == 'object') {
			for (const item of options.keys()) {
				if (item === 'type') {
					this.extension = options.get(item);
				}
			}
		}
		this.faker = faker;
	}


	public generate(): string {
		return this.faker.system.commonFileName(this.extension);
	}
}
