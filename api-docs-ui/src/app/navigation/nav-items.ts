import { NavItem } from './nav-item';

export const NAV_ITEMS: NavItem[] = [
	{
		id: 'nav-endpoints',
		translateKey: 'navigation.endpoints',
		menu: false,
		route: ''
	},
	{
		id: 'nav-tools',
		translateKey: 'navigation.tools',
		menu: true,
		children: [
			{
				id: 'nav-locust-generator',
				translateKey: 'navigation.locust.generator',
				menu: false,
				route: 'locust-generator'
			},
		]
	},

];
