import { Subscription } from 'rxjs';

import { Injectable, OnDestroy } from '@angular/core';

import { AuthGuardService } from '../auth/auth-guard.service';
import { NavItem } from './nav-item';
import { NAV_ITEMS } from './nav-items';

@Injectable({ providedIn: 'root' })
export class NavigationService implements OnDestroy {

	public navItems: NavItem[] = NAV_ITEMS;
	public visibleNavItems: NavItem[] = [];

	private roleSubscription!: Subscription;

	constructor(private readonly authService: AuthGuardService) {

		this.updateNavItems();
	}

	public ngOnDestroy(): void {
		this.roleSubscription.unsubscribe();
	}

	private updateNavItems(): void {
		this.visibleNavItems = [];
		const deepCopy: NavItem[] = JSON.parse(JSON.stringify(this.navItems));
		for (const navItem of deepCopy) {
			this.addNavItemsForRole(navItem, this.visibleNavItems);
		}
	}

	private addNavItemsForRole(navItem: NavItem, list: NavItem[]): void {
		if (navItem.menu) {
			if (this.hasChild(navItem)) {
				const temp = JSON.parse(JSON.stringify(navItem.children));
				navItem.children = [];
				for (const child of temp || []) {
					this.addNavItemsForRole(child, navItem.children);
				}
				if (navItem.children.length !== 0) {
					list.push(navItem);
				}
			}
		} else {
			list.push(navItem);
		}
	}

	private hasChild(navItem: NavItem): boolean {
		if (navItem.children && navItem.children?.length > 0) {
			return true;
		}
		return false;
	}

}
