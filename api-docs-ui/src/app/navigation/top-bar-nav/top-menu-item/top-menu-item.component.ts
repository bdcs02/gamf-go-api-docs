import { NavItem } from '../../nav-item';

import { Component, Input, ViewChild } from '@angular/core';
import { MatMenuPanel } from '@angular/material/menu';
import { Router } from '@angular/router';
import { QueryParamNavigationService } from 'src/app/query-param-navigation.service';

@Component({
	selector: 'top-menu-item',
	templateUrl: 'top-menu-item.component.html',
	styleUrls: ['./top-menu-item.component.scss']
})
export class TopMenuItemComponent {
	@Input() items?: NavItem[] = [];
	@ViewChild('childMenu', { static: true }) public childMenu!: MatMenuPanel;
	constructor(
		private readonly router: Router,
		private readonly navigationService: QueryParamNavigationService
	) {}

	public async navigate(route: string | undefined | null): Promise<void> {
		if (route !== undefined) {
			await this.router.navigate(['.'], { queryParams: { path: route } });
			this.navigationService.Navigate();
		}
	}
}
