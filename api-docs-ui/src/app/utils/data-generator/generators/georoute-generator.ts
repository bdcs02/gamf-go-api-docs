import { Generator } from '../generator';
import { faker } from '@faker-js/faker';

export class GeorouteGenerator implements Generator {

	private readonly lat: number = -10;
	private readonly lon: number = 10;

	constructor(options: Map<string, any>) {
		if (typeof options == 'object') {
			for (const item of options.keys()) {
				if (item === 'lon') {
					this.lon = options.get(item);
				}
				if (item === 'lat') {
					this.lat = options.get(item);
				}
			}
		}
	}

	public generate(): string {
		return faker.location.nearbyGPSCoordinate({ origin: [this.lon, this.lat] }).toString();
	}

}
