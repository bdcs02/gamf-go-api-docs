import { BehaviorSubject } from 'rxjs';

import { Injectable } from '@angular/core';

export type ThemeOption = 'light' | 'dark' | 'auto';
export type ColorOption = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
	public currentTheme: BehaviorSubject<ThemeOption> = new BehaviorSubject<ThemeOption>('auto');
	public currentColor: BehaviorSubject<ColorOption> = new BehaviorSubject<ColorOption>('dark');

	private readonly themePath: string = 'theme';

	constructor() {
		this.reloadDarkModeFromLocalStorage();
		this.listenToSystemThemeChange();
	}

	public changeTheme(): void {
		if (this.currentTheme.getValue() === 'auto') {
			document.body.classList.remove('dark-theme');
			(document.querySelector('html') as HTMLElement).style.colorScheme = 'light';
			this.setDarkModeLocalStorage('light');
			this.currentTheme.next('light');
			this.currentColor.next('light');
		} else if (this.currentTheme.getValue() === 'light') {
			(document.querySelector('html') as HTMLElement).style.colorScheme = 'dark';
			document.body.classList.add('dark-theme');
			this.setDarkModeLocalStorage('dark');
			this.currentTheme.next('dark');
			this.currentColor.next('dark');
		} else {
			this.setDarkModeLocalStorage('auto');
			this.reloadDarkModeFromLocalStorage();
		}
	}

	private listenToSystemThemeChange(): void {
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
			this.reloadDarkModeFromLocalStorage();
		});
	}

	private reloadDarkModeFromLocalStorage(): void {
		this.currentTheme.next(this.getDarkModeLocalStorage());
		if (this.currentTheme.getValue() === 'dark' || this.isInAutoDarkMode()) {
			(document.querySelector('html') as HTMLElement).style.colorScheme = 'dark';
			document.body.classList.add('dark-theme');
			this.currentColor.next('dark');
		} else {
			(document.querySelector('html') as HTMLElement).style.colorScheme = 'light';
			document.body.classList.remove('dark-theme');
			this.currentColor.next('light');
		}
	}

	private getDarkModeLocalStorage(): ThemeOption {
		const theme = localStorage.getItem(this.themePath);
		if (theme) {
			return theme as ThemeOption;
		}
		return 'auto';
	}

	private setDarkModeLocalStorage(themeOption: ThemeOption): void {
		localStorage.setItem(this.themePath, themeOption);
	}

	private isInAutoDarkMode(): boolean {
		return this.currentTheme.getValue() === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

}
