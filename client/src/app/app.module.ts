import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MTCCommonModule, MTCCoreModule, SimpleConfirmationComponent } from 'mtc-modules';
import { MaterialModule } from '@angular/material';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HomeComponent } from './home/home.component';
import { UserService } from './services/UserService/user.service';
import { PermissionsComponent } from './permissions/permissions.component';
import { routes } from './app.routes';
import { NewUserComponent } from './permissions/new-user/new-user.component';
import { EditUserComponent } from './permissions/edit-user/edit-user.component';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		PermissionsComponent,
		NewUserComponent,
		EditUserComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		MTCCoreModule.forRoot(),
		MTCCommonModule,
		CoreModule,
		MaterialModule.forRoot(),
		RouterModule.forRoot(routes, {useHash: true}),
		SimpleNotificationsModule
	],
	providers: [
		UserService
	],
	bootstrap: [AppComponent],
	entryComponents: [
		SimpleConfirmationComponent,
		NewUserComponent,
		EditUserComponent
	]
})
export class AppModule { }
