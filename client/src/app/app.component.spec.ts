/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {
	MTCEnvStubComponent, MTCDialogStubComponent, MTCLayoutStubComponent,
	SimpleNotificationsStubComponent, SideBarStubComponent, CreateIssueStubComponent, ViewIssueStubComponent,
	RouterOutletStubComponent
} from '../testing/app-stubs.stub';
import { ToolbarStubComponent } from '../testing/material-module-stubs';
import { RouterStub } from '../testing/router.stubs';
import { UserService } from './services/UserService/user.service';
import { By } from '@angular/platform-browser';
import { MTCUser } from 'mtc-modules';
import { IssueService } from './services/IssueService/issue.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { returnObserverWithCallback } from '../testing/observerHelpers';

class MTCUserStub {
	public getUser(){
		return returnObserverWithCallback({ id: 123 }, false);
	}
}

let currentUser = { ldsid: '123', role: 'admin', fullName: 'test name' };
class UserServiceStub {
	public currentUser = currentUser;
	public get currentLdsAccount$() {
		return returnObserverWithCallback({name: 'new name'}, false);
	}
	public setCurrentLdsAccountSource(account) {}
	public setCurrentUserSource(user) {}
	public getUser(id) {
		return returnObserverWithCallback({
			currentUser
		}, true);
	}
	public isAdmin() {
		return currentUser.role === 'admin';
	}
	public isUser() {
		return currentUser.role === 'user';
	}
}

class IssueServiceStub {
	public get openCreateSideNav$() {
		return returnObserverWithCallback(null, false);
	}
	public get openViewSideNav$() {
		return returnObserverWithCallback({test: 'test'}, false);
	}
	public filter(text) {}
}

describe('AppComponent: Client', () => {
	let comp: AppComponent;
	let fixture: ComponentFixture<AppComponent>;
	let mtcUser: MTCUserStub;
	let userService: UserServiceStub;
	let issueService: IssueServiceStub;
	let router: RouterStub;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				AppComponent, MTCEnvStubComponent, MTCDialogStubComponent, MTCLayoutStubComponent,
				SimpleNotificationsStubComponent, ToolbarStubComponent, SideBarStubComponent,
				CreateIssueStubComponent, ViewIssueStubComponent, RouterOutletStubComponent
			],
			imports: [
				FormsModule
			],
			providers: [
				{ provide:MTCUser, useClass: MTCUserStub },
				{ provide:UserService, useClass:UserServiceStub },
				{ provide:IssueService, useClass: IssueServiceStub },
				{ provide:Router, useClass:RouterStub },
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AppComponent);

		comp = fixture.componentInstance; // BannerComponent test instance

		mtcUser = fixture.debugElement.injector.get(MTCUser);
		userService = fixture.debugElement.injector.get(UserService);
		issueService = fixture.debugElement.injector.get(IssueService);
		router = fixture.debugElement.injector.get(Router);
	});

	it('should create the app', async(() => {
		expect(comp).toBeTruthy();
	}));

	it('should get user and not navigate on init', async(() => {
		spyOn(router, 'navigate').and.callThrough();
		fixture.detectChanges();
		expect(router.navigate).not.toHaveBeenCalled();
	}));

	it('should get user and navigate on init', async(() => {
		currentUser.role = 'test';
		spyOn(router, 'navigate').and.callThrough();
		fixture.detectChanges();
		expect(router.navigate).toHaveBeenCalledWith(['/unauth']);
		currentUser.role = 'admin';
	}));

	it('should logout properly', () => {
		comp.logoutVisible = true;
		fixture.detectChanges();
		let MTCAuth = {
			logout() {}
		};
		(<any>window).MTCAuth = MTCAuth;

		spyOn(MTCAuth,'logout').and.callThrough();
		let logoutButton = fixture.debugElement.query(By.css('#logout-dropdown'));
		logoutButton.triggerEventHandler('click', {});
		expect(MTCAuth.logout).toHaveBeenCalled();
	});
});
