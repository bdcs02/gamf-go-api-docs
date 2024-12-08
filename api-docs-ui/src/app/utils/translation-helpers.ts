import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs';

export function appInitializer(translate: TranslateService): () => Promise<void> {
	return async () => {
		const defaultLanguage = 'hu';
		translate.setDefaultLang(defaultLanguage);
		await firstValueFrom(translate.use(defaultLanguage));
	};
}

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
