/* eslint-disable max-len */

export interface GeneratorParam {
	name: string;
	description: string;
	required: string;
	default?: string;
}

export interface ParamsExplainer {
	name: string;
	description: string;
}

export interface GeneratorProps {
	id: string;
	name: string;
	description?: string;
	syntax: string;
	params?: GeneratorParam[];
	paramsExplainer?: ParamsExplainer[];
	example?: string;
}

export interface DataGenerator {
	dataGenerator: {
		generalInformation: {
			[key: string]: GeneratorProps;
		};
		generators: {
			[key: string]: GeneratorProps;
		};
	};
}

export const DATA_GENERATOR: DataGenerator = {
	dataGenerator: {
		generalInformation: {
			GENERAL: {
				id: 'GENERAL',
				name: 'Általános',
				description: 'Az alkalmazásban kérés összeállításkor lehetséges minta alapján adatokat generálni. A funkció minden beviteli mezőnél elérhető. A mezőben lévő szöveg vizsgálásra kerül, ha található benne a megadott minta akkor a kérés elküldése előtt a generált adatok a megfelelő helyre beillesztésre kerülnek. A generálási minta hasonló mint egy függvényhívás, tartalmazhat opcionális paramétereket, megszorításokat.',
				syntax: '${dg:GENERÁLÁS MINTA}',
			}
		},
		generators: {
			NUMBER: {
				id: 'NUMBER',
				name: 'Szám',
				description: 'Egy véletlenszerű egész számot ad vissza a generálási paraméterek alapján. Ha a paraméterek nem kerülnek kitöltésre akkor az alapértelmezett tartományban kerül a szám generálásra.',
				syntax: 'number(min?=#;max?=#)',
				params: [
					{ name: 'min', description: 'Minimum érték', required: 'Nem', default: '0' },
					{ name: 'max', description: 'Maximum érték', required: 'Nem', default: '10000' },
				]
			},
			FLOAT: {
				id: 'FLOAT',
				name: 'Lebegőpontos szám',
				description: 'Egy véletlenszerű lebegőpontos számot ad vissza a generálási paraméterek alapján. Ha a paraméterek nem kerülnek kitöltésre akkor az alapértelmezett tartományban kerül a lebegőpontos szám generálásra.',
				syntax: 'float(min?=#;max?=#)',
				params: [
					{ name: 'min', description: 'Minimum érték', required: 'Nem', default: '0' },
					{ name: 'max', description: 'Maximum érték', required: 'Nem', default: '10000' },
				]

			},
			BOOLEAN: {
				id: 'BOOLEAN',
				name: 'Logikai típus',
				description: 'Egy véletlenszerűen generált logikai típust ad vissza.',
				syntax: 'boolean()',
			},
			STRING: {
				id: 'STRING',
				name: 'Szöveg',
				description: 'Véletlenszerű karaktereket tartalmazó sorozatot ad vissza az angol ABC betűiből. Ha a paraméterek nem kerülnek kitöltésre akkor az alapértelmezett hosszúságú szöveg kerül generálásra.',
				syntax: 'string(min?=#;max?=#)',
				params: [
					{ name: 'min', description: 'Minimum hossz', required: 'Nem', default: '0' },
					{ name: 'max', description: 'Maximum hossz', required: 'Nem', default: '100' },
				]
			},
			EMAIL: {
				id: 'EMAIL',
				name: 'Email',
				description: 'Egy email címet ad vissza a generálási paraméterek alapján. Ha a paraméterek nem kerülnek kitöltésre akkor véletlenszerűen generálódik az email.',
				syntax: 'email(firstName?=#;lastName?=#;provider?=#)',
				params: [
					{ name: 'firstName', description: 'Keresztnév', required: 'Nem' },
					{ name: 'lastName', description: 'Vezetéknév', required: 'Nem' },
					{ name: 'provider', description: 'Szolgáltató', required: 'Nem' },
				]
			},
			PASSWORD: {
				id: 'PASSWORD',
				name: 'Jelszó',
				description: 'Egy véletlenszerűen generált jelszót ad vissza a generálási paraméterek alapján. Ha a paraméter nem kerül kitöltésre akkor véletlenszerűen generálódik a jelszó.',
				syntax: 'password(length?=#;memorable?=#;pattern?=#;prefix?=#)',
				params: [
					{ name: 'length', description: 'Hosszúság', required: 'Nem' },
					{ name: 'memorable', description: '4‐5 szó egymásba generálás engedélyezése', required: 'Nem' },
					{ name: 'pattern', description: 'Regex minta alapján jelszó generálás', required: 'Nem' },
					{ name: 'prefix', description: 'Jelszó előtti prefix', required: 'Nem' },
				],
			},
			WORD: {
				id: 'WORD',
				name: 'Szó',
				description: 'Egy véletlenszerű szót ad vissza a generálási paraméter alapján. Ha a paraméter nem kerül kitöltésre akkor véletlenszerűen generálódik a szó.',
				syntax: 'word(type?=#)',
				params: [
					{ name: 'type', description: 'Szó típusa*', required: 'Nem' },
				],
				paramsExplainer: [
					{ name: 'adjective', description: 'melléknév' },
					{ name: 'adverb', description: 'határozószó' },
					{ name: 'noun', description: 'főnév' },
				]
			},
			USERNAME: {
				id: 'USERNAME',
				name: 'Felhasználónév',
				description: 'Egy véletlenszerű felhasználónevet ad vissza a generálási paraméterek alapján. Ha a paraméterek nem kerülnek kitöltésre akkor véletlenszerűen generálódik a felhasználónév',
				syntax: 'username(firstName?=#;lastName?=#)',
				params: [
					{ name: 'firstName', description: 'Keresztnév', required: 'Nem' },
					{ name: 'lastName', description: 'Vezetéknév', required: 'Nem' },
				]
			},
			LOREM: {
				id: 'LOREM',
				name: 'Lorem',
				description: 'Hagyományos, latin Lorem Ipsum szöveget ad vissza a generálási paraméterek alapján. Ha a paraméterek nem kerülnek kitöltésre akkor az alapértelmezett érték alapján generálódik a felhasználónév.',
				syntax: 'lorem(min?=#;max?=#)',
				params: [
					{ name: 'min', description: 'Minimum hossz', required: 'Nem', default: '1' },
					{ name: 'max', description: 'Maximum hossz', required: 'Nem', default: '5' },
				]
			},
			FILENAME: {
				id: 'FILENAME',
				name: 'Fájlnév',
				description: 'Egy véletlenszerű fájlnevet ad vissza a generálási paraméter alapján. Ha a paraméter nem kerül kitöltésre akkor véletlenszerűen generálódik a fájlnév.',
				syntax: 'filename(type?=#)',
				params: [
					{ name: 'type', description: 'Fájl kiterjesztése', required: 'Nem' },
				]
			},
			IP: {
				id: 'IP',
				name: 'IP cím',
				description: 'Egy véletlenszerű IP címet ad vissza a generálási paraméter alapján. Ha a paraméter nem kerül kitöltésre akkor véletlenszerűen generálódik az IP cím.',
				syntax: 'ip(type?=#)',
				params: [
					{ name: 'type', description: 'ipv4 vagy ipv6', required: 'Nem' },
				]
			},
			URL: {
				id: 'URL',
				name: 'URL cím',
				description: 'Egy véletlenszerűen generált URL címet ad vissza a generálási paraméter alapján. Ha a paraméter nem kerül kitöltésre akkor véletlenszerűen generálódik az URL cím.',
				syntax: 'url(protocol?=#)',
				params: [
					{ name: 'protocol', description: 'http vagy https', required: 'Nem' },
				]
			},
			REGEX: {
				id: 'REGEX',
				name: 'Regex',
				description: 'A paraméterben található mintára illeszkedő szöveget ad vissza. A „pattern” paraméter kitöltése kötelező.',
				syntax: 'regex(pattern=#)',
				params: [
					{ name: 'pattern', description: 'Regex mintázat', required: 'Igen' },
				]
			},
			AVATAR: {
				id: 'AVATAR',
				name: 'Kép',
				description: 'Egy véletlenszerű képet generál a generálási paraméterek alapján. Ha a paraméterek nem kerülnek kitöltésre akkor az alapértelmezett értékekkel generálódik a kép.',
				syntax: 'avatar(width?=#;height?=#)',
				params: [
					{ name: 'width', description: 'szélesség', required: 'Nem', default: '500' },
					{ name: 'height', description: 'magasság', required: 'Nem', default: '500' },
				]
			},
			DATE: {
				id: 'DATE',
				name: 'Dátum',
				description: 'Egy véletlenszerű dátumot ad vissza a generálási paraméterek alapján. A dátum formátuma „yyyy.MM.dd.”. Ha a paraméterek nem kerülnek kitöltésre akkor az alapértelmezett értékekkel generálódik a dátum.',
				syntax: 'date(min?=#;max?=#;timestamp?=#;format?=#;locale?=#)',
				params: [
					{ name: 'min', description: 'Kezdő dátum', required: 'Nem', default: '0' },
					{ name: 'max', description: 'Befejező dátum', required: 'Nem', default: 'Aktuális dátum' },
					{ name: 'timestamp', description: 'Időbélyeg', required: 'Nem', default: 'false' },
					{ name: 'format', description: 'Formátum', required: 'Nem', default: 'yyyy.MM.dd' },
					{ name: 'locale', description: 'Lokalizáció', required: 'Nem', default: 'Aktuális dátum' },
				]
			},
			GEOROUTE: {
				id: 'GEOROUTE',
				name: 'Geolokációs koordináta',
				description: 'Egy tömböt ad vissza, amely tartalmazza a szélességi és hosszúsági kört a generálási paraméterek alapján. Ha a paraméterek nem kerülnek kitöltésre akkor az alapértelmezett értékekkel generálódik a koordináta.',
				syntax: 'georoute(lat?=#;lon?=#)',
				example: '[ SZÉLESSÉGI KÖR, HOSSZÚSÁGI KÖR ]',
				params: [
					{ name: 'lat', description: 'Szélességi kör', required: 'Nem', default: '-10' },
					{ name: 'lon', description: 'Hosszúsági kör', required: 'Nem', default: '10' },
				],
			},
			HTTP_METHOD: {
				id: 'HTTP_METHOD',
				name: 'HTTP Metódus',
				description: 'Egy véletlenszerű HTTP metódust ad vissza.',
				syntax: 'httpMethod()'
			},
			HTTP_STATUS: {
				id: 'HTTP_STATUS',
				name: 'HTTP Státuszkód',
				description: 'Egy véletlenszerű HTTP státuszkódot ad vissza a generálási paraméter alapján. Ha a paraméter nem kerül kitöltésre akkor véletlenszerűen generálódik az állapotkód. ',
				syntax: ': httpStatus(type?=#)',
				params: [
					{ name: 'type', description: 'Státuszkód típusa*', required: 'Nem' },
				],
				paramsExplainer: [
					{ name: 'informational', description: 'tájékoztató információ' },
					{ name: 'success', description: 'sikeres kérés' },
					{ name: 'clientError', description: 'kliens hiba' },
					{ name: 'serverError', description: 'szerver hiba' },
					{ name: 'redirection', description: 'átirányítás' },
				]
			},
			ARRAY: {
				id: 'ARRAY',
				name: 'Tömb',
				description: 'Egy véletlenszerűen generált tömböt ad vissza a generálási paraméterek alapján. A „type” és a „length” kötelező elem.',
				syntax: 'array(type=#;length=#)',
				params: [
					{ name: 'type', description: 'Típus', required: 'Igen' },
					{ name: 'length', description: 'Hossz', required: 'Igen' },
				]
			}
		}
	}
};
