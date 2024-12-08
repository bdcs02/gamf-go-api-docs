/* eslint-disable complexity */
import { Generator } from '../generator';
import { fakerAF_ZA } from '@faker-js/faker';
import { fakerAR } from '@faker-js/faker';
import { fakerAZ } from '@faker-js/faker';
import { fakerCS_CZ } from '@faker-js/faker';
import { fakerDA } from '@faker-js/faker';
import { fakerDE } from '@faker-js/faker';
import { fakerDE_AT } from '@faker-js/faker';
import { fakerDE_CH } from '@faker-js/faker';
import { fakerDV } from '@faker-js/faker';
import { fakerEL } from '@faker-js/faker';
import { fakerEN } from '@faker-js/faker';
import { fakerEN_AU } from '@faker-js/faker';
import { fakerEN_AU_ocker } from '@faker-js/faker';
import { fakerEN_BORK } from '@faker-js/faker';
import { fakerEN_CA } from '@faker-js/faker';
import { fakerEN_GB } from '@faker-js/faker';
import { fakerEN_GH } from '@faker-js/faker';
import { fakerEN_HK } from '@faker-js/faker';
import { fakerEN_IE } from '@faker-js/faker';
import { fakerEN_IN } from '@faker-js/faker';
import { fakerEN_NG } from '@faker-js/faker';
import { fakerEN_US } from '@faker-js/faker';
import { fakerEN_ZA } from '@faker-js/faker';
import { fakerEO } from '@faker-js/faker';
import { fakerES } from '@faker-js/faker';
import { fakerES_MX } from '@faker-js/faker';
import { fakerFA } from '@faker-js/faker';
import { fakerFI } from '@faker-js/faker';
import { fakerFR } from '@faker-js/faker';
import { fakerFR_BE } from '@faker-js/faker';
import { fakerFR_CA } from '@faker-js/faker';
import { fakerFR_CH } from '@faker-js/faker';
import { fakerFR_LU } from '@faker-js/faker';
import { fakerFR_SN } from '@faker-js/faker';
import { fakerHE } from '@faker-js/faker';
import { fakerHR } from '@faker-js/faker';
import { fakerHU } from '@faker-js/faker';
import { fakerHY } from '@faker-js/faker';
import { fakerID_ID } from '@faker-js/faker';
import { fakerIT } from '@faker-js/faker';
import { fakerJA } from '@faker-js/faker';
import { fakerKA_GE } from '@faker-js/faker';
import { fakerKO } from '@faker-js/faker';
import { fakerLV } from '@faker-js/faker';
import { fakerMK } from '@faker-js/faker';
import { fakerNB_NO } from '@faker-js/faker';
import { fakerNE } from '@faker-js/faker';
import { fakerNL } from '@faker-js/faker';
import { fakerNL_BE } from '@faker-js/faker';
import { fakerPL } from '@faker-js/faker';
import { fakerPT_BR } from '@faker-js/faker';
import { fakerPT_PT } from '@faker-js/faker';
import { fakerRO } from '@faker-js/faker';
import { fakerRO_MD } from '@faker-js/faker';
import { fakerRU } from '@faker-js/faker';
import { fakerSK } from '@faker-js/faker';
import { fakerSR_RS_latin } from '@faker-js/faker';
import { fakerSV } from '@faker-js/faker';
import { fakerTH } from '@faker-js/faker';
import { fakerTR } from '@faker-js/faker';
import { fakerUK } from '@faker-js/faker';
import { fakerUR } from '@faker-js/faker';
import { fakerUZ_UZ_latin } from '@faker-js/faker';
import { fakerVI } from '@faker-js/faker';
import { fakerYO_NG } from '@faker-js/faker';
import { fakerZH_CN } from '@faker-js/faker';
import { fakerZH_TW } from '@faker-js/faker';
import { fakerZU_ZA } from '@faker-js/faker';

import { NumberGenerator } from '../generators/number-generator';
import { StringGenerator } from '../generators/string-generator';
import { ArrayGenerator } from '../generators/array-generator';
import { DateGenerator } from '../generators/date-generator';
import { RegexGenerator } from '../generators/regex-generator';
import { Logger } from '../generators/logger';
import { EmailGenerator } from '../generators/email-generator';
import { WordGenerator } from '../generators/word-generator';
import { FilenameGenerator } from '../generators/filename-generator';
import { GeorouteGenerator } from '../generators/georoute-generator';
import { FloatGenerator } from '../generators/float-generator';
import { PasswordGenerator } from '../generators/password-generator';
import { UsernameGenerator } from '../generators/username-generator';
import { BooleanGenerator } from '../generators/boolean-generator';
import { LoremGenerator } from '../generators/lorem-generator';
import { IpGenerator } from '../generators/ip-generator';
import { HttpMethodGenerator } from '../generators/http-method-generator';
import { UrlGenerator } from '../generators/url-generator';
import { AvatarGenerator } from '../generators/avatar-generator';
import { HttpStatusGenerator } from '../generators/http-statuscode-generator';
import { SettingsForm } from 'src/app/endpoint/datasheet/endpoint-form';
import { FormGroup } from '@angular/forms';
import { Faker } from '@faker-js/faker';
import { GeneralForm } from 'src/app/tools/locust-generator/generator-form';

export enum GeneratorTypes {
	STRING = 'string',
	NUMBER = 'number',
	REGEX = 'regex',
	ARRAY = 'array',
	LOREM = 'lorem',
	DATE = 'date',
	EMAIL = 'email',
	BOOLEAN = 'boolean',
	USERNAME = 'username',
	PASSWORD = 'password',
	FLOAT = 'float',
	GEOROUTE = 'georoute',
	FILENAME = 'filename',
	WORD = 'word',
	IP = 'ip',
	HTTP_METHOD = 'httpMethod',
	HTTP_STATUS = 'httpStatus',
	URL = 'url',
	AVATAR = 'avatar'
}

export class GeneratorFactory {
	public getGenerator(
		type: string,
		options: Map<string, any> | string,
		settings?: FormGroup<SettingsForm>,
		locust?: FormGroup<GeneralForm>
	): Generator {
		let fakerOptions = this.getFakerLocale('en');

		if (settings) {
			fakerOptions = this.getFakerLocale(settings.controls.locale.value ? settings.controls.locale.value : 'en');
			if (settings.controls.dgSeed.value !== '') {
				fakerOptions.seed(Number(settings.controls.dgSeed.value));
			}
		}

		if (locust) {
			fakerOptions = this.getFakerLocale(locust.value.locale ? locust.value.locale : 'en');
			if (locust.controls.seed.value > -1) {
				fakerOptions.seed(Number(locust.controls.seed.value));
			}
		}

		switch (type) {
			case GeneratorTypes.NUMBER:
				return new NumberGenerator(options as Map<string, any>);
			case GeneratorTypes.STRING:
				return new StringGenerator(options as Map<string, any>);
			case GeneratorTypes.EMAIL:
				return new EmailGenerator(options as Map<string, any>, fakerOptions);
			case GeneratorTypes.PASSWORD:
				return new PasswordGenerator(options as Map<string, any>);
			case GeneratorTypes.WORD:
				return new WordGenerator(options as Map<string, any>, fakerOptions);
			case GeneratorTypes.ARRAY:
				return new ArrayGenerator(options as Map<string, any>);
			case GeneratorTypes.DATE:
				return new DateGenerator(options as Map<string, any>);
			case GeneratorTypes.BOOLEAN:
				return new BooleanGenerator();
			case GeneratorTypes.FLOAT:
				return new FloatGenerator(options as Map<string, any>);
			case GeneratorTypes.FILENAME:
				return new FilenameGenerator(options as Map<string, any>, fakerOptions);
			case GeneratorTypes.USERNAME:
				return new UsernameGenerator(options as Map<string, any>, fakerOptions);
			case GeneratorTypes.GEOROUTE:
				return new GeorouteGenerator(options as Map<string, any>);
			case GeneratorTypes.LOREM:
				return new LoremGenerator(options as Map<string, any>);
			case GeneratorTypes.IP:
				return new IpGenerator(options as Map<string, any>);
			case GeneratorTypes.REGEX:
				return new RegexGenerator(options as Map<string, any>);
			case GeneratorTypes.HTTP_METHOD:
				return new HttpMethodGenerator();
			case GeneratorTypes.HTTP_STATUS:
				return new HttpStatusGenerator(options as Map<string, any>);
			case GeneratorTypes.URL:
				return new UrlGenerator(options as Map<string, any>);
			case GeneratorTypes.AVATAR:
				return new AvatarGenerator(options as Map<string, any>);
			default:
				return new Logger();
		}
	}

	public getFakerLocale(settings: any): Faker {
		switch (settings) {
			case 'hu-HU':
				return fakerHU;
			case 'af-ZA':
				return fakerAF_ZA;
			case 'ar':
				return fakerAR;
			case 'az':
				return fakerAZ;
			case 'cs-CZ':
				return fakerCS_CZ;
			case 'da':
				return fakerDA;
			case 'de':
				return fakerDE;
			case 'de-AT':
				return fakerDE_AT;
			case 'de-CH':
				return fakerDE_CH;
			case 'dv':
				return fakerDV;
			case 'el':
				return fakerEL;
			case 'en':
				return fakerEN;
			case 'en-AU':
				return fakerEN_AU;
			case 'en-AU-ocker':
				return fakerEN_AU_ocker;
			case 'en-BORK':
				return fakerEN_BORK;
			case 'en-CA':
				return fakerEN_CA;
			case 'en-GB':
				return fakerEN_GB;
			case 'en-GH':
				return fakerEN_GH;
			case 'en-HK':
				return fakerEN_HK;
			case 'en-IE':
				return fakerEN_IE;
			case 'en-IN':
				return fakerEN_IN;
			case 'en-NG':
				return fakerEN_NG;
			case 'en-US':
				return fakerEN_US;
			case 'en-ZA':
				return fakerEN_ZA;
			case 'eo':
				return fakerEO;
			case 'es':
				return fakerES;
			case 'es-MX':
				return fakerES_MX;
			case 'fa':
				return fakerFA;
			case 'fi':
				return fakerFI;
			case 'fr':
				return fakerFR;
			case 'fr-BE':
				return fakerFR_BE;
			case 'fr-CA':
				return fakerFR_CA;
			case 'fr-CH':
				return fakerFR_CH;
			case 'fr-LU':
				return fakerFR_LU;
			case 'fr-SN':
				return fakerFR_SN;
			case 'he':
				return fakerHE;
			case 'hr':
				return fakerHR;
			case 'hy':
				return fakerHY;
			case 'id-ID':
				return fakerID_ID;
			case 'it':
				return fakerIT;
			case 'ja':
				return fakerJA;
			case 'ka-GE':
				return fakerKA_GE;
			case 'ko':
				return fakerKO;
			case 'lv':
				return fakerLV;
			case 'mk':
				return fakerMK;
			case 'nb-NO':
				return fakerNB_NO;
			case 'ne':
				return fakerNE;
			case 'nl':
				return fakerNL;
			case 'nl-BE':
				return fakerNL_BE;
			case 'pl':
				return fakerPL;
			case 'pt-BR':
				return fakerPT_BR;
			case 'pt-PT':
				return fakerPT_PT;
			case 'ro':
				return fakerRO;
			case 'ro-MD':
				return fakerRO_MD;
			case 'ru':
				return fakerRU;
			case 'sk':
				return fakerSK;
			case 'sr-RS-latin':
				return fakerSR_RS_latin;
			case 'sv':
				return fakerSV;
			case 'th':
				return fakerTH;
			case 'tr':
				return fakerTR;
			case 'uk':
				return fakerUK;
			case 'ur':
				return fakerUR;
			case 'uz-UZ-latin':
				return fakerUZ_UZ_latin;
			case 'vi':
				return fakerVI;
			case 'yo-NG':
				return fakerYO_NG;
			case 'zh-CN':
				return fakerZH_CN;
			case 'zh-TW':
				return fakerZH_TW;
			case 'zu-ZA':
				return fakerZU_ZA;
			default:
				return fakerEN;
		}
	}
}
