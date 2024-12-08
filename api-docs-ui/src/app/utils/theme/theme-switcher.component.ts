import { Component } from '@angular/core';

import { ThemeService } from './theme.service';

@Component({
	selector: 'theme-switcher',
	templateUrl: 'theme-switcher.component.html'
})
export class ThemeSwitcherComponent {
	constructor(public readonly themeService: ThemeService) { }
}
