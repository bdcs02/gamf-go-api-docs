import { GeneratorTypes } from 'src/app/utils/data-generator/factory/generator-factory';

export interface RandomType {
	name: string;
	generatorType?: GeneratorTypes;
	optionsMap?: Map<string, any>;
	option?: string;
	type?: string;
}

export const randomList: RandomType[] = [
	{ name: 'Szöveg', generatorType: GeneratorTypes.STRING, type: 'string', optionsMap: new Map() as Map<string, any> },
	{ name: 'Szám', generatorType: GeneratorTypes.NUMBER, optionsMap: new Map() as Map<string, any> },
	{
		name: 'Regex',
		generatorType: GeneratorTypes.REGEX,
		type: 'string',
		optionsMap: new Map<string, any>([['pattern', new RegExp('(.*)')]]),
		option: 'pattern'
	},
	{ name: 'Lorem', generatorType: GeneratorTypes.LOREM, type: 'string', optionsMap: new Map() as Map<string, any> },
	{ name: 'Dátum', generatorType: GeneratorTypes.DATE, type: 'string', optionsMap: new Map() as Map<string, any> },
	{ name: 'Email', generatorType: GeneratorTypes.EMAIL, type: 'string', optionsMap: new Map() as Map<string, any> },
	{ name: 'Logikai változó', generatorType: GeneratorTypes.BOOLEAN, optionsMap: new Map() as Map<string, any> },
	{ name: 'Felhasználónév', generatorType: GeneratorTypes.USERNAME, type: 'string', optionsMap: new Map() as Map<string, any> },
	{ name: 'Jelszó', generatorType: GeneratorTypes.PASSWORD, type: 'string', optionsMap: new Map() as Map<string, any> },
	{ name: 'Lebegőpontos szám', generatorType: GeneratorTypes.FLOAT, optionsMap: new Map() as Map<string, any> },
	{ name: 'Geolokációs adat', generatorType: GeneratorTypes.GEOROUTE, type: 'string', optionsMap: new Map() as Map<string, any> },
	{ name: 'Fájlnév', generatorType: GeneratorTypes.FILENAME, type: 'string', optionsMap: new Map() as Map<string, any> },
	{ name: 'Szó', generatorType: GeneratorTypes.WORD, type: 'string', optionsMap: new Map() as Map<string, any> },
	{ name: 'IP', generatorType: GeneratorTypes.IP, type: 'string', optionsMap: new Map<string, any>([['type', 'ipv4']]), option: 'type' },
	{ name: 'HTTP metódus', generatorType: GeneratorTypes.HTTP_METHOD, type: 'string', optionsMap: new Map() as Map<string, any> },
	{ name: 'HTTP státusz', generatorType: GeneratorTypes.HTTP_STATUS, optionsMap: new Map() as Map<string, any> },
	{ name: 'URL', generatorType: GeneratorTypes.URL, type: 'string', optionsMap: new Map() as Map<string, any> },
	{ name: 'Avatár', generatorType: GeneratorTypes.AVATAR, type: 'string', optionsMap: new Map() as Map<string, any> },
	{ name: 'Szótár' }
];
