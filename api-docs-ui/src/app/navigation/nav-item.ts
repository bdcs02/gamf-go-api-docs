export interface NavItem {
	id: string;
	translateKey: string;
	route?: string;
	children?: NavItem[];
	menu: boolean;
	icon?: string;
	operation?: string;
}
