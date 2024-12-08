import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ThemeSwitcherComponent } from './theme-switcher.component';
import { ThemeService } from './theme.service';

@NgModule({
	imports: [MatButtonModule, MatIconModule, CommonModule],
	exports: [ThemeSwitcherComponent],
	declarations: [ThemeSwitcherComponent],
	providers: [ThemeService]
})
export class ThemeModule { }
