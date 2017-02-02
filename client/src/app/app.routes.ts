import { Routes } from '@angular/router';
import { PermissionsComponent } from './permissions/permissions.component';
import { HomeComponent } from './home/home.component';
import { UnauthComponent } from './unauth/unauth.component';
import { CalendarComponent } from './calendar/calendar.component';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'permissions', component: PermissionsComponent},
	{ path: 'calendar', component: CalendarComponent},
	{ path: 'unauth', component: UnauthComponent},
	{ path: '**', redirectTo: ''}
];
