import { NavigationService } from 'src/app/navigation/navigation.service';
import { Component } from '@angular/core';
import 'zone.js/plugins/zone-patch-rxjs';
import { DatabaseService } from './database/database.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	constructor(
		public readonly nav: NavigationService,
		private readonly db: DatabaseService
	) {
	}
}
