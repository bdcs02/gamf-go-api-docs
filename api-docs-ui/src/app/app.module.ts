import { NgJsonEditorModule } from 'ang-jsoneditor';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { NgxFilesizeModule } from 'ngx-filesize';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ApiService, initApp } from 'src/app/endpoint/api.service';
import { EndpointDatasheetComponent } from 'src/app/endpoint/datasheet/endpoint-datasheet.component';
import { RequestEditorComponent } from 'src/app/endpoint/datasheet/request-editor/request-editor.component';
import { ResponseComponent } from 'src/app/endpoint/datasheet/response/response.component';
import { EndpointInfoComponent } from 'src/app/endpoint/list/endpoint-info/endpoint-info.component';

import { DatePipe, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import localeHuExtra from '@angular/common/locales/extra/hu';
import localeHu from '@angular/common/locales/hu';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { EndpointListComponent } from './endpoint/list/endpoint-list.component';
import { AccessForbiddenComponent } from './http/access-forbidden/access-forbidden.component';
import { HttpErrorInterceptor } from './http/http-error.interceptor';
import { HttpOptionsInterceptor } from './http/http-options.interceptor';
import { NotFoundComponent } from './http/not-found/not-found.component';
import { NavItemListComponent } from './navigation/top-bar-nav/nav-item-list/nav-item-list.component';
import { TopBarNavComponent } from './navigation/top-bar-nav/top-bar-nav.component';
import { TopMenuItemComponent } from './navigation/top-bar-nav/top-menu-item/top-menu-item.component';
import { NotificationContainerComponent } from './notification/notification-container/notification-container.component';
import { NotificationComponent } from './notification/notification/notification.component';
import { CellDataPipe } from './utils/common-table/cell-data.pipe';
import { CommonTableComponent } from './utils/common-table/common-table.component';
import { AutocompleteFilterComponent } from './utils/common-table/filter/autocomplete-filter/autocomplete-filter.component';
import { DateFilterComponent } from './utils/common-table/filter/date-filter.component.html/date-filter.component';
import { FilterComponent } from './utils/common-table/filter/filter.component';
import { SortComponent } from './utils/common-table/sort/sort.component';
import { ButtonFrameComponent } from './utils/component-frame/button-frame/button-frame.component';
import { FrameComponent } from './utils/component-frame/frame.component';
import { CustomDateAdapter } from './utils/custom-date-adapter';
import { DataSheetChipsComponent } from './utils/datasheet-field/datasheet-chips/datasheet-chips.component';
import { DataSheetFieldComponent } from './utils/datasheet-field/datasheet-field/datasheet-field.component';
import { DatasheetJsonComponent } from './utils/datasheet-field/datasheet-json/datasheet-json.component';
import { DataSheetLinkComponent } from './utils/datasheet-field/datasheet-link/datasheet-link.component';
import { DataSheetTextAreaComponent } from './utils/datasheet-field/datasheet-textarea/datasheet-textarea.component';
import { ConfirmDialogComponent } from './utils/dialog/confirm-dialog.component';
import { DirectiveModule } from './utils/directives/directives.module';
import { DynamicPipe } from './utils/dynamic.pipe';
import { FormFieldsModule } from './utils/form-fields/form-fields.module';
import { FrameModule } from './utils/frames/frames.module';
import { IdleDialogComponent } from './utils/idle/idle-dialog.component';
import { InformationDialogComponent } from './utils/information-dialog/information-dialog.component';
import { MaterialModule } from './utils/material.module';
import { PaginationTranslationService } from './utils/pagination-translation.service';
import { RequestProgressComponent } from './utils/request-progress/request-progress.component';
import { RequestProgressService } from './utils/request-progress/request-progress.service';
import { SimpleTableComponent } from './utils/simple-table/simple-table.component';
import { ThemeModule } from './utils/theme/theme.module';
import { appInitializer, createTranslateLoader } from './utils/translation-helpers';
import { KeyValueEditorComponent } from './key-value-editor/key-value-editor.component';
import { TextViewerComponent } from './endpoint/viewers/text-viewer/text-viewer.component';
import { MethodChipComponent } from './endpoint/method-chip/method-chip.component';
import { XmlViewerComponent } from './endpoint/viewers/xml-viewer/xml-viewer.component';
import { NuMonacoEditorModule } from '@ng-util/monaco-editor';
import { ByteArrayViewerComponent } from './endpoint/viewers/byte-array-viewer/byte-array-viewer.component';
import { FileRequestBodyComponent } from './endpoint/datasheet/request-editor/request-body/file-request-body/file-request-body.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { StructMapperComponent } from './endpoint/viewers/struct-mapper/struct-mapper.component';
import { TextRequestBodyComponent } from './endpoint/datasheet/request-editor/request-body/text-request-body/text-request-body.component';
import { CurlGeneratorComponent } from './endpoint/curl-generator/curl-generator.component';
import { HeaderListComponent } from './endpoint/datasheet/header-list/header-list.component';
import { MonacoEditorComponent } from 'src/app/utils/monaco-editor/monaco-editor.component';
import { UrlParametersComponent } from './endpoint/datasheet/url-parameters/url-parameters.component';
import { VariablesComponent } from './endpoint/datasheet/variables/variables.component';
import { AuthorizationComponent } from './endpoint/datasheet/authorization/authorization.component';
import { FileUploadAccessorDirective } from './form-data/file-upload-accessor';
import { ApiKeyAuthorizationComponent } from './endpoint/datasheet/authorization/api-key-authorization/api-key-authorization.component';
// eslint-disable-next-line max-len
import { BearerTokenAuthorizationComponent } from './endpoint/datasheet/authorization/bearer-token-authorization/bearer-token-authorization.component';
import { KeycloakAuthorizationComponent } from './endpoint/datasheet/authorization/keycloak-authorization/keycloak-authorization.component';
import { SaveRequestComponent } from './endpoint/save-request/save-request.component';
import { KeycloakErrorComponent } from './http/keycloak-error/keycloak-error.component';
import { LoadRequestComponent } from './endpoint/load-request/load-request.component';
import { FormDataComponent } from './form-data/form-data.component';
import { MatIconModule } from '@angular/material/icon';
import { GlobalVariablesDialogComponent } from './endpoint/global-variables-dialog/global-variables-dialog.component';
import { DatabaseService } from './database/database.service';
import { LocustGeneratorComponent } from './tools/locust-generator/locust-generator.component';
import { LocustGeneralComponent } from './tools/locust-generator/locust-general/locust-general.component';
import { DgInformationComponent } from './endpoint/datasheet/dg-information/dg-information.component';
import { SettingsComponent } from './endpoint/datasheet/settings/settings.component';
import { LocustModulsComponent } from './tools/locust-generator/locust-moduls/locust-moduls.component';
import { LocustModulAddDialogComponent } from './tools/locust-generator/locust-moduls/locust-modul-add-dialog/locust-modul-add-dialog.component';
import { LocustModulDetailsComponent } from './tools/locust-generator/locust-moduls/locust-modul-details/locust-modul-details.component';
import { LocustAuthComponent } from './tools/locust-generator/locust-auth/locust-auth.component';
import { OathExpansionComponent } from './tools/locust-generator/locust-auth/oath-expansion/oath-expansion.component';
import { LocustModulResponseComponent } from './tools/locust-generator/locust-moduls/locust-modul-response/locust-modul-response.component';
// eslint-disable-next-line max-len
import { LocustModulRequestBodyComponent } from './tools/locust-generator/locust-moduls/locust-modul-request-body/locust-modul-request-body.component';
import { RequestTypeComponent } from './tools/locust-generator/locust-moduls/locust-modul-request-body/request-type/request-type.component';
import { LocustGeneratedModulComponent } from './tools/locust-generator/locust-moduls/locust-generated-modul/locust-generated-modul.component';
import { DataGeneratorContentComponent } from './endpoint/datasheet/dg-information/data-generator-content/data-generator-content.component';
import { LocustModulAuthTypeComponent } from './tools/locust-generator/locust-moduls/locust-modul-auth-type/locust-modul-auth-type.component';
import { ApiKeyExpansionComponent } from './tools/locust-generator/locust-auth/api-key-expansion/api-key-expansion.component';
import { BearerTokenExpansionComponent } from './tools/locust-generator/locust-auth/bearer-token-expansion/bearer-token-expansion.component';
import { LocustFilesComponent } from './tools/locust-generator/locust-files/locust-files.component';
import { LocustDictionariesComponent } from './tools/locust-generator/locust-dictionaries/locust-dictionaries.component';

registerLocaleData(localeHu, 'hu-HU', localeHuExtra);

@NgModule({
	declarations: [
		DynamicPipe,
		AppComponent,
		RequestProgressComponent,
		TopBarNavComponent,
		NavItemListComponent,
		TopMenuItemComponent,
		CommonTableComponent,
		FilterComponent,
		CellDataPipe,
		FrameComponent,
		ButtonFrameComponent,
		DataSheetChipsComponent,
		DataSheetFieldComponent,
		DatasheetJsonComponent,
		DataSheetLinkComponent,
		DataSheetTextAreaComponent,
		ConfirmDialogComponent,
		DateFilterComponent,
		AutocompleteFilterComponent,
		IdleDialogComponent,
		SortComponent,
		NotificationComponent,
		NotificationContainerComponent,
		NotFoundComponent,
		DgInformationComponent,
		AccessForbiddenComponent,
		SimpleTableComponent,
		EndpointListComponent,
		InformationDialogComponent,
		EndpointInfoComponent,
		EndpointDatasheetComponent,
		RequestEditorComponent,
		ResponseComponent,
		KeyValueEditorComponent,
		ByteArrayViewerComponent,
		TextViewerComponent,
		MethodChipComponent,
		FileRequestBodyComponent,
		SettingsComponent,
		XmlViewerComponent,
		CurlGeneratorComponent,
		TextRequestBodyComponent,
		FormDataComponent,
		HeaderListComponent,
		UrlParametersComponent,
		MonacoEditorComponent,
		VariablesComponent,
		AuthorizationComponent,
		BearerTokenAuthorizationComponent,
		ApiKeyAuthorizationComponent,
		KeycloakAuthorizationComponent,
		StructMapperComponent,
		SaveRequestComponent,
		KeycloakErrorComponent,
		LoadRequestComponent,
		DataGeneratorContentComponent,
		FileUploadAccessorDirective,
		GlobalVariablesDialogComponent,
		LocustGeneratorComponent,
		LocustGeneralComponent,
		LocustModulsComponent,
		LocustModulAddDialogComponent,
		LocustModulDetailsComponent,
		LocustAuthComponent,
		OathExpansionComponent,
		LocustModulResponseComponent,
		LocustModulRequestBodyComponent,
		RequestTypeComponent,
		LocustGeneratedModulComponent,
		LocustModulAuthTypeComponent,
		ApiKeyExpansionComponent,
		BearerTokenExpansionComponent,
		LocustFilesComponent,
		LocustDictionariesComponent
	],
	imports: [
		AuthModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		BrowserModule,
		DirectiveModule,
		FrameModule,
		FormsModule,
		HttpClientModule,
		MaterialModule,
		MatTreeModule,
		FormFieldsModule,
		NgxJsonViewerModule,
		NgJsonEditorModule,
		ThemeModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient]
			}
		}),
		ReactiveFormsModule,
		NgxJsonViewerModule,
		NgxFilesizeModule,
		MatIconModule,
		KeycloakAngularModule,
		MatSidenavModule,
		NuMonacoEditorModule.forRoot({
			baseUrl: '/api/apidoc/ui/assets/monaco-editor/min',
			monacoLoad(monaco) {
				monaco.languages.register({ id: 'vars' });
				monaco.languages.setMonarchTokensProvider('vars', {
					tokenizer: {
						root: [
							[/\$\{[a-zA-Z_]\w*\}/, 'variable'],
							[/\$\{dg:[A-z]*(\(\)|\((.*?)\))\}/, 'variable']
						]
					}
				});
			}
		})
	],
	providers: [
		DynamicPipe,
		HttpClient,
		RequestProgressService,
		DatePipe,
		{
			provide: APP_INITIALIZER,
			useFactory: appInitializer,
			deps: [TranslateService],
			multi: true
		},
		{
			provide: APP_INITIALIZER,
			useFactory: initApp,
			deps: [KeycloakService, ApiService, DatabaseService],
			multi: true
		},
		{
			provide: LOCALE_ID,
			useValue: 'hu-HU'
		},
		{
			provide: MAT_DATE_LOCALE,
			useValue: 'hu-HU'
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpOptionsInterceptor,
			multi: true
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpErrorInterceptor,
			multi: true
		},
		{ provide: DateAdapter, useClass: CustomDateAdapter },
		{ provide: MatPaginatorIntl, useClass: PaginationTranslationService }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
