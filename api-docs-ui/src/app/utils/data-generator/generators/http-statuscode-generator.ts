import { Generator } from '../generator';
import { faker } from '@faker-js/faker';

export type HTTPStatusCodeType =
	| 'informational'
	| 'success'
	| 'clientError'
	| 'serverError'
	| 'redirection';

export class HttpStatusGenerator implements Generator {

	private readonly httpType: HTTPStatusCodeType = 'success';

	constructor(options: Map<string, any>) {
		if (typeof options == 'object') {
			for (const item of options.keys()) {
				if (item === 'type') {
					this.httpType = options.get(item);
				}
			}
		}
	}

	public generate(): string {
		return faker.internet.httpStatusCode({ types: [this.httpType] }).toString();
	}

}
