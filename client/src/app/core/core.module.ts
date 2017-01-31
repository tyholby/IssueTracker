import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MTCCommonModule } from 'mtc-modules';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import {
	SidebarComponent,
} from './components';

import {
	WindowRefService,
	HostnameService,
} from './services';
let dialogComponents = [
];

let components = [
	SidebarComponent,
	...dialogComponents
];

let directives = [
];

let services = [
	WindowRefService,
	HostnameService,
	DatePipe,
];

let modules = [
	CommonModule,
	FormsModule,
	MaterialModule,
	RouterModule,
	MTCCommonModule
];

@NgModule({
	declarations: [ components, directives ],
	imports: modules,
	providers: [ services ],
	exports: [ components, directives ],
	entryComponents: dialogComponents
})
export class CoreModule {

};
