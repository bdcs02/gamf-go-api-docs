import { Generator } from '../generator';
import { faker } from '@faker-js/faker';

export class PasswordGenerator implements Generator {

	private length: number | undefined;
	private memorable: boolean | undefined;
	private pattern: RegExp | undefined;
	private prefix: string | undefined;

	constructor(options: Map<string, any>) {
		if (typeof options == 'object') {
			for (const item of options.keys()) {
				if (item === 'length') {
					this.length = options.get(item);
				}
				if (item === 'memorable') {
					this.memorable = options.get(item);
				}
				if (item === 'pattern') {
					this.pattern = new RegExp(options.get(item));
				}
				if (item === 'prefix') {
					this.prefix = options.get(item);
				}
			}
		}
	}

	public generate(): string {
		return faker.internet.password({ length: this.length, memorable: this.memorable, pattern: this.pattern, prefix: this.prefix });
	}

}
