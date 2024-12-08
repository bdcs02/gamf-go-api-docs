import { Generator } from '../generator';
import { faker } from '@faker-js/faker';

export type HTTPProtocolType = 'http' | 'https';

export class UrlGenerator implements Generator {

	private readonly protocol: HTTPProtocolType = 'https';

	constructor(options: Map<string, any>) {
		if (typeof options == 'object') {
			for (const item of options.keys()) {
				if (item === 'protocol') {
					this.protocol = options.get(item);
				}
			}
		}
	}

	public generate(): string {
		return faker.internet.url({ protocol: this.protocol });
	}

}
