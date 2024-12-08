import { Generator } from '../generator';
import { faker } from '@faker-js/faker';
import { GeneratorBase } from '../generator-base';
import { formatDate } from '@angular/common';

export class DateGenerator extends GeneratorBase implements Generator {

	private isTimestamp: boolean = false;
	private formatPattern: string = 'yyyy.MM.dd';
	private locale: string = 'hu-HU';

	constructor(options: Map<string, any>) {
		super(0, (new Date()).getTime());
		if (typeof options === 'object') {
			for (const item of options.keys()) {
				if (item === 'min') {
					this.setMin(options.get(item));
				}
				if (item === 'max') {
					this.setMax(options.get(item));
				}
				if (item === 'timestamp') {
					this.isTimestamp = options.get(item);
				}
				if (item === 'format') {
					this.formatPattern = options.get(item);
				}
				if (item === 'locale') {
					this.locale = options.get(item);
				}
			}
		}
	}

	public generate(): string {
		if (this.isTimestamp) {
			return faker.date.between({ from: this.getMin(), to: this.getMax() }).getTime().toString();
		}
		else {
			return formatDate(faker.date.between({ from: this.getMin(), to: this.getMax() }), this.formatPattern, this.locale);
		}
	}

}
