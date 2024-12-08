import { CommonAuthGuard } from 'src/app/auth/common-auth-guard';
import { EndpointDatasheetComponent } from 'src/app/endpoint/datasheet/endpoint-datasheet.component';
import { EndpointListComponent } from 'src/app/endpoint/list/endpoint-list.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccessForbiddenComponent } from './http/access-forbidden/access-forbidden.component';
import { NotFoundComponent } from './http/not-found/not-found.component';
import { KeycloakErrorComponent } from './http/keycloak-error/keycloak-error.component';
import { LocustGeneratorComponent } from './tools/locust-generator/locust-generator.component';

const routes: Routes = [
	{
		path: 'not-found',
		component: NotFoundComponent,
		canActivate: [CommonAuthGuard]
	},
	{
		path: 'access-forbidden',
		component: AccessForbiddenComponent,
		canActivate: [CommonAuthGuard]
	},
	{
		path: 'keycloak-error',
		component: KeycloakErrorComponent,
		canActivate: [CommonAuthGuard]
	},
	{
		path: '',
		component: EndpointListComponent,
		pathMatch: 'full',
	},
	{
		path: 'locust-generator',
		component: LocustGeneratorComponent,
		pathMatch: 'full',
	},
	{
		path: 'endpoint',
		component: EndpointDatasheetComponent,
	},
	{ path: '**', component: NotFoundComponent }
];
@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
