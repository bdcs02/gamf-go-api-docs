import { NavItem } from '../nav-item';

import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
@Component({
	selector: 'top-bar-nav',
	templateUrl: 'top-bar-nav.component.html',
	styleUrls: ['top-bar-nav.component.scss']
})
export class TopBarNavComponent {
	@Input() items: NavItem[] = [];
	version: string = 'v' + environment.version;
}
