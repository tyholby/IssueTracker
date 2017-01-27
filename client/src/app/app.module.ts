import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MTCCommonModule, MTCCoreModule, SimpleConfirmationComponent } from 'mtc-modules';
import { MaterialModule } from '@angular/material';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { RouterModule } from '@angular/router';
import { DndModule } from 'ng2-dnd';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HomeComponent } from './home/home.component';
import { UserService } from './services/UserService/user.service';
import { PermissionsComponent } from './permissions/permissions.component';
import { routes } from './app.routes';
import { NewUserComponent } from './permissions/new-user/new-user.component';
import { EditUserComponent } from './permissions/edit-user/edit-user.component';
import { StatusService } from './services/StatusService/status.service';
import { NewStatusComponent } from './permissions/new-status/new-status.component';
import { IssueService } from './services/IssueService/issue.service';
import { CreateIssueComponent } from './create-issue/create-issue.component';
import { AttachmentService } from './services/AttachmentService/attachment.service';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		PermissionsComponent,
		NewUserComponent,
		EditUserComponent,
		NewStatusComponent,
		CreateIssueComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		MTCCoreModule.forRoot(),
		MTCCommonModule,
		CoreModule,
		MaterialModule.forRoot(),
		RouterModule.forRoot(routes, { useHash: true }),
		DndModule.forRoot(),
		SimpleNotificationsModule
	],
	providers: [
		UserService,
		StatusService,
		AttachmentService,
		IssueService
	],
	bootstrap: [AppComponent],
	entryComponents: [
		SimpleConfirmationComponent,
		NewUserComponent,
		EditUserComponent,
		NewStatusComponent,
	]
})
export class AppModule {
}
