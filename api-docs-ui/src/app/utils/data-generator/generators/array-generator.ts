/* eslint-disable id-blacklist */
/* eslint-disable @typescript-eslint/prefer-for-of */
import { Generator } from '../generator';
import { BooleanGenerator } from './boolean-generator';
import { DateGenerator } from './date-generator';
import { EmailGenerator } from './email-generator';
import { FilenameGenerator } from './filename-generator';
import { FloatGenerator } from './float-generator';
import { GeorouteGenerator } from './georoute-generator';
import { IpGenerator } from './ip-generator';
import { Logger } from './logger';
import { LoremGenerator } from './lorem-generator';
import { NumberGenerator } from './number-generator';
import { PasswordGenerator } from './password-generator';
import { StringGenerator } from './string-generator';
import { UsernameGenerator } from './username-generator';
import { WordGenerator } from './word-generator';
import { AvatarGenerator } from './avatar-generator';
import { HttpMethodGenerator } from './http-method-generator';
import { HttpStatusGenerator } from './http-statuscode-generator';
import { UrlGenerator } from './url-generator';
import { RegexGenerator } from './regex-generator';
import { GeneratorTypes } from '../factory/generator-factory';

interface ArrayData {
	type: string;
	length: number;
	params: Map<string, any>;
}

export class ArrayGenerator implements Generator {

	private readonly arrayGenerator: ArrayData;

	constructor(options: Map<string, any>) {
		this.arrayGenerator = {
			length: options.get('length'),
			params: options.get('params'),
			type: options.get('type'),
		};
	}

	public generate(): string {
		const arr: string[] = [];

		const generatorMapping: { [key in GeneratorTypes]: any } = {
			[GeneratorTypes.AVATAR]: AvatarGenerator,
			[GeneratorTypes.BOOLEAN]: BooleanGenerator,
			[GeneratorTypes.DATE]: DateGenerator,
			[GeneratorTypes.EMAIL]: EmailGenerator,
			[GeneratorTypes.FILENAME]: FilenameGenerator,
			[GeneratorTypes.FLOAT]: FloatGenerator,
			[GeneratorTypes.GEOROUTE]: GeorouteGenerator,
			[GeneratorTypes.HTTP_METHOD]: HttpMethodGenerator,
			[GeneratorTypes.HTTP_STATUS]: HttpStatusGenerator,
			[GeneratorTypes.IP]: IpGenerator,
			[GeneratorTypes.LOREM]: LoremGenerator,
			[GeneratorTypes.NUMBER]: NumberGenerator,
			[GeneratorTypes.PASSWORD]: PasswordGenerator,
			[GeneratorTypes.STRING]: StringGenerator,
			[GeneratorTypes.WORD]: WordGenerator,
			[GeneratorTypes.ARRAY]: ArrayGenerator,
			[GeneratorTypes.URL]: UrlGenerator,
			[GeneratorTypes.USERNAME]: UsernameGenerator,
			[GeneratorTypes.REGEX]: RegexGenerator,
		};
		const GeneratorClass = generatorMapping[this.arrayGenerator.type as GeneratorTypes];
		if (GeneratorClass) {
			for (let i = 0; i < this.arrayGenerator.length; i++) {
				const generatedClass = this.arrayGenerator.type === GeneratorTypes.BOOLEAN ||
					this.arrayGenerator.type === GeneratorTypes.HTTP_METHOD
					? new GeneratorClass() :
					new GeneratorClass(this.arrayGenerator.params);
				arr.push(generatedClass.generate());
			}
		}
		else {
			return new Logger().generate();
		}
		return `[${arr.toString()}]`;
	}

}
