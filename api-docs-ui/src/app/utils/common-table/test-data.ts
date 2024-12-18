export interface UserData {
	id: string;
	name: string;
	progress: string;
	color: string;
	birth: Date;
}

const COLORS = [
	'maroon',
	'red',
	'orange',
	'yellow',
	'olive',
	'green',
	'purple',
	'fuchsia',
	'lime',
	'teal',
	'aqua',
	'blue',
	'navy',
	'black',
	'gray'
];
const NAMES = [
	'Maia',
	'Asher',
	'Olivia',
	'Atticus',
	'Amelia',
	'Jack',
	'Charlotte',
	'Theodore',
	'Isla',
	'Oliver',
	'Isabella',
	'Jasper',
	'Cora',
	'Levi',
	'Violet',
	'Arthur',
	'Mia',
	'Thomas',
	'Elizabeth'
];

export function createNewUser(id: number): UserData {
	const name =
		NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' + NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

	return {
		id: id.toString(),
		name,
		progress: Math.round(Math.random() * 100).toString(),
		birth: new Date(),
		color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
	};
}
