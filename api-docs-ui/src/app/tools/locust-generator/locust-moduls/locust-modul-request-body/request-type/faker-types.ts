interface Option {
	name: string;
	type?: string;
}

export interface FakerType {
	method: string;
	name: string;
	options?: Option[];
}

export const fakerList: FakerType[] = [
	{
		name: 'Szöveg',
		method: 'pystr',
		options: [{ name: 'min_chars' }, { name: 'max_chars' }]
	},
	{
		name: 'Szám',
		method: 'pyint',
		options: [{ name: 'min_value' }, { name: 'max_value' }]
	},
	{ name: 'Lorem', method: 'sentence', options: [{ name: 'nb_words' }] },
	{
		name: 'Dátum',
		method: 'date',
		options: [{ name: 'pattern' }, { name: 'end_datetime' }]
	},
	{ name: 'Email', method: 'email', options: [{ name: 'domain' }] },
	{ name: 'Logikai típus', method: 'pybool', options: [{ name: 'truth_probability' }] },
	{ name: 'Felhasználónév', method: 'user_name' },
	{
		name: 'Jelszó',
		method: 'password',
		options: [
			{ name: 'length' },
			{ name: 'special_chars', type: 'bool' },
			{ name: 'digits', type: 'bool' },
			{ name: 'upper_case', type: 'bool' },
			{ name: 'lower_case', type: 'bool' }
		]
	},
	{
		name: 'Lebegőpontos szám',
		method: 'pyfloat',
		options: [{ name: 'left_digits' }, { name: 'right_digits' }]
	},
	{ name: 'Geolokációs adat', method: 'latlng' },
	{ name: 'Fájlnév', method: 'file_name', options: [{ name: 'extension' }] },
	{ name: 'Szó', method: 'word' },
	{ name: 'IPv4 cím', method: 'ipv4' },
	{ name: 'IPv6 cím', method: 'ipv6' },
	{ name: 'HTTP metódus', method: 'http_method' },
	{ name: 'HTTP Státusz', method: 'http_status_code' },
	{ name: 'URL', method: 'url' },
	{
		name: 'Avatár',
		method: 'image_url',
		options: [{ name: 'width' }, { name: 'height' }]
	}
];
