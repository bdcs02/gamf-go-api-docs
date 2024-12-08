import { Generator } from '../generator';
import { faker } from '@faker-js/faker';

export class AvatarGenerator implements Generator {

	private readonly width: number = 500;
	private readonly height: number = 500;

	constructor(options: Map<string, any>) {
		if (typeof options == 'object') {
			for (const item of options.keys()) {
				if (item === 'width') {
					this.width = options.get(item);
				}
				if (item === 'height') {
					this.height = options.get(item);
				}
			}
		}
	}

	public generate(): string {
		return faker.image.url({ width: this.width, height: this.height });
	}

}
