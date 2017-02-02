/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PermissionsComponent } from './permissions.component';
import { UserService } from '../services/UserService/user.service';
import { MTCDialogService, MTCCommonModule } from 'mtc-modules';
import { StatusService } from '../services/StatusService/status.service';
import { ProgressBarStubComponent } from '../../testing/material-module-stubs';
import { FormsModule } from '@angular/forms';
import { RouterStub } from '../../testing/router.stubs';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DndModule } from 'ng2-dnd';
import { returnObserverWithCallback } from '../../testing/observerHelpers';

let currentUser = { ldsid: '123', role: 'test', fullName: 'test name' };
let user2 = { ldsid: '234', role: 'user', fullName: 'test name2' };
let userLoaded = true;
class UserServiceStub {
	public currentUser = currentUser;
	public get currentUser$() {
		return returnObserverWithCallback(currentUser, false);
	}
	public getUsers() {
		return returnObserverWithCallback([currentUser, user2], true);
	}
	public userLoaded() {
		return userLoaded;
	}
	public isAdmin() {
		return currentUser.role === 'admin';
	}
	public isUser() {
		return currentUser.role === 'user';
	}
}

let status = {
	id: '333',
	description: 'test',
	ordernum: 1,
};
class StatusServiceStub {
	public getStatuses() {
		return returnObserverWithCallback([status], true);
	}
	public updateStatuses(statuses) {
		return returnObserverWithCallback({}, false);
	}
	public moveStatusIssues(movetoObj) { // { id, moveto }
		return returnObserverWithCallback({}, false);
	}
}

class NotificationsServiceStub {
	error(arg1, arg2) {};
}

let dialogConfirmed = false;
class MTCDialogServiceStub {
	public show(arg1, arg2, arg3, arg4) {
		return returnObserverWithCallback(dialogConfirmed, false);
	}
}

describe('PermissionsComponent', () => {
	let comp: PermissionsComponent;
	let fixture: ComponentFixture<PermissionsComponent>;
	let userService: UserServiceStub;
	let dialogService: MTCDialogServiceStub;
	let statusService: StatusServiceStub;
	let router: RouterStub;
	let notificationsService: NotificationsServiceStub;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				PermissionsComponent, ProgressBarStubComponent
			],
			imports: [
				FormsModule,
				MTCCommonModule,
				DndModule.forRoot(),
			],
			providers: [
				{ provide:UserService, useClass:UserServiceStub },
				{ provide:MTCDialogService, useClass:MTCDialogServiceStub },
				{ provide:StatusService, useClass:StatusServiceStub },
				{ provide:Router, useClass:RouterStub },
				{ provide:NotificationsService, useClass:NotificationsServiceStub },
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PermissionsComponent);

		comp = fixture.componentInstance; // BannerComponent test instance

		userService = fixture.debugElement.injector.get(UserService);
		dialogService = fixture.debugElement.injector.get(MTCDialogService);
		statusService = fixture.debugElement.injector.get(StatusService);
		router = fixture.debugElement.injector.get(Router);
		notificationsService = fixture.debugElement.injector.get(NotificationsService);
	});

	it('should navigate to unauth on init', async(() => {
		spyOn(router, 'navigate').and.callThrough();
		fixture.detectChanges();
		expect(router.navigate).toHaveBeenCalledWith(['/unauth']);
	}));

	it('should not get users', async(() => {
		spyOn(userService, 'getUsers').and.callThrough();
		spyOn(statusService, 'getStatuses').and.callThrough();
		currentUser.role = null;
		comp.resetUsers();
		expect(userService.getUsers).not.toHaveBeenCalled();
		currentUser.role = 'admin';
	}));

	it('should reset users, admins, and statuses on init', async(() => {
		currentUser.role = 'admin';
		spyOn(userService, 'getUsers').and.callThrough();
		spyOn(statusService, 'getStatuses').and.callThrough();
		fixture.detectChanges();
		expect(comp.statuses[0]).toBe(status);
		expect(comp.admins[0]).toBe(currentUser);
		expect(comp.users[0]).toBe(user2);
		expect(userService.getUsers).toHaveBeenCalled();
		expect(statusService.getStatuses).toHaveBeenCalled();
	}));

	it('should add user on click', async(() => {
		dialogConfirmed = false;
		currentUser.role = 'admin';
		fixture.detectChanges();
		spyOn(comp, 'resetUsers');
		let addUserButton = fixture.debugElement.query(By.css('._add-user-button'));
		addUserButton.triggerEventHandler('click', {});
		expect(comp.resetUsers).not.toHaveBeenCalled();
		dialogConfirmed = true;
		addUserButton.triggerEventHandler('click', {});
		expect(comp.resetUsers).toHaveBeenCalled();
		dialogConfirmed = false;
	}));

	it('should edit user on click', async(() => {
		dialogConfirmed = false;
		currentUser.role = 'admin';
		fixture.detectChanges();
		spyOn(comp, 'resetUsers');
		let editUserButton = fixture.debugElement.query(By.css('._edit-user-button'));
		editUserButton.triggerEventHandler('click', {});
		expect(comp.resetUsers).not.toHaveBeenCalled();
		dialogConfirmed = true;
		editUserButton.triggerEventHandler('click', {});
		expect(comp.resetUsers).toHaveBeenCalled();
		dialogConfirmed = false;
	}));

	it('should add status on click', async(() => {
		dialogConfirmed = false;
		currentUser.role = 'admin';
		fixture.detectChanges();
		spyOn(comp, 'resetStatuses');
		let addStatusButton = fixture.debugElement.query(By.css('._add-status-button'));
		addStatusButton.triggerEventHandler('click', {});
		expect(comp.resetStatuses).not.toHaveBeenCalled();
		dialogConfirmed = true;
		addStatusButton.triggerEventHandler('click', {});
		expect(comp.resetStatuses).toHaveBeenCalled();
		dialogConfirmed = false;
	}));

	it('should delete status on click', async(() => {
		dialogConfirmed = null;
		currentUser.role = 'admin';
		fixture.detectChanges();
		spyOn(comp, 'resetStatuses');
		spyOn(notificationsService, 'error');
		let deleteStatusButton = fixture.debugElement.query(By.css('._delete-status-button'));
		deleteStatusButton.triggerEventHandler('click', {});
		expect(comp.resetStatuses).not.toHaveBeenCalled();
		expect(notificationsService.error).toHaveBeenCalled();
		comp.statuses.push(comp.statuses[0]);
		deleteStatusButton.triggerEventHandler('click', {});
		expect(comp.resetStatuses).not.toHaveBeenCalled();
		dialogConfirmed = true;
		deleteStatusButton.triggerEventHandler('click', {});
		expect(comp.resetStatuses).toHaveBeenCalled();
		dialogConfirmed = false;
	}));

	it('should edit status on click', async(() => {
		currentUser.role = 'admin';
		fixture.detectChanges();
		expect(comp.editStatuses).toBe(false);
		let editStatusButton = fixture.debugElement.query(By.css('.edit-statuses-button'));
		editStatusButton.triggerEventHandler('click', {});
		expect(comp.editStatuses).toBe(true);
	}));

	it('should save status on click', async(() => {
		currentUser.role = 'admin';
		spyOn(statusService, 'updateStatuses').and.callThrough();
		fixture.detectChanges();
		comp.statuses.push(comp.statuses[0]);
		let saveStatusButton = fixture.debugElement.query(By.css('.edit-statuses-button'));
		saveStatusButton.triggerEventHandler('click', {});
		saveStatusButton.triggerEventHandler('click', {});
		expect(statusService.updateStatuses).not.toHaveBeenCalled();
		saveStatusButton.triggerEventHandler('click', {});
		comp.statuses[1].edited = true;
		saveStatusButton.triggerEventHandler('click', {});
		expect(statusService.updateStatuses).toHaveBeenCalled();
		expect(comp.editStatuses).toBe(false);
		comp.statuses.push(comp.statuses[0]);
		comp.statuses[1].edited = true;
		comp.saveStatuses();
		expect(comp.editStatuses).toBe(false);
	}));

	it('should fix status order on dragend', async(() => {
		currentUser.role = 'admin';
		fixture.detectChanges();
		comp.statuses.push({
			id: '1234545',
			description: 'test',
			ordernum: 2,
		});
		comp.statuses[0].ordernum = 6;
		let draggableStatusButton = fixture.debugElement.query(By.css('._status-draggable'));
		draggableStatusButton.triggerEventHandler('dragend', {});
		expect(comp.statuses[0].ordernum).toBe(1);
	}));

});








