import { Generator } from '../generator';
import { Faker } from '@faker-js/faker';

export class WordGenerator implements Generator {

	private wordType: string | undefined;
	private faker: Faker;

	constructor(options: Map<string, any>, faker: Faker) {
		if (typeof options == 'object') {
			for (const item of options.keys()) {
				if (item === 'type') {
					this.wordType = options.get(item);
				}
			}
		}
		this.faker = faker;
	}


	public generate(): string {
		switch (this.wordType) {
			case 'adjective':
				return this.faker.word.adjective();
			case 'adverb':
				return this.faker.word.adverb();
			case 'noun':
				return this.faker.word.noun();
			default:
				return this.faker.word.sample();
		}
	}

}
