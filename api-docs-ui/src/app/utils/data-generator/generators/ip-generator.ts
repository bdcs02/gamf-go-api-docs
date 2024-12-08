import { Generator } from '../generator';
import { faker } from '@faker-js/faker';

export class IpGenerator implements Generator {
	private ipType: string = '';

	constructor(options: Map<string, any>) {
		if (typeof options == 'object') {
			for (const item of options.keys()) {
				if (item === 'type') {
					this.ipType = options.get(item);
				}
			}
		}
	}

	public generate(): string {
		switch (this.ipType) {
			case 'ipv4':
				return faker.internet.ipv4();
			case 'ipv6':
				return faker.internet.ipv6();
			default:
				return faker.internet.ip();
		}
	}

}
