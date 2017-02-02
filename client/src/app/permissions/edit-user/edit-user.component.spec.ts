/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MTCDialogService, MTCCommonModule } from 'mtc-modules';
import { ProgressBarStubComponent } from '../../../testing/material-module-stubs';
import { FormsModule } from '@angular/forms';
import { EditUserComponent } from './edit-user.component';
import { UserService } from '../../services/UserService/user.service';
import { returnObserverWithCallback } from '../../../testing/observerHelpers';

let currentUser = { ldsid: 'not 123', role: 'admin', fullName: 'test name' };
class UserServiceStub {
	public currentUser = currentUser;
	public setCurrentUserSource(user) {}
	public updateUser(user) {
		return returnObserverWithCallback({}, false);
	}
	public deleteUser(user) {
		return returnObserverWithCallback({}, false);
	}
}

let userData = {
	ldsid: '123', role: 'admin', fullName: 'test name'
};
class MTCDialogServiceStub {
	public hide(data) {}
	public getData() {
		return userData;
	}
}

describe('EditUserComponent', () => {
	let comp: EditUserComponent;
	let fixture: ComponentFixture<EditUserComponent>;
	let userService: UserServiceStub;
	let dialogService: MTCDialogServiceStub;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				EditUserComponent, ProgressBarStubComponent
			],
			imports: [
				FormsModule,
				MTCCommonModule,
			],
			providers: [
				{ provide:UserService, useClass:UserServiceStub },
				{ provide:MTCDialogService, useClass:MTCDialogServiceStub },
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EditUserComponent);

		comp = fixture.componentInstance; // BannerComponent test instance

		userService = fixture.debugElement.injector.get(UserService);
		dialogService = fixture.debugElement.injector.get(MTCDialogService);
	});

	it('should set selectedUser on init', async(() => {
		fixture.detectChanges();
		expect(comp.selectedUser.ldsid).toBe('123');
	}));

	it('should set role on click', async(() => {
		spyOn(userService, 'setCurrentUserSource').and.callThrough();
		fixture.detectChanges();
		let adminButton = fixture.debugElement.query(By.css('._admin-role-selector'));
		let userButton = fixture.debugElement.query(By.css('._user-role-selector'));
		userButton.triggerEventHandler('click', {});
		expect(comp.selectedUser.role).toBe('user');
		adminButton.triggerEventHandler('click', {});
		expect(comp.selectedUser.role).toBe('admin');
		expect(userService.setCurrentUserSource).toHaveBeenCalledWith(currentUser);

		const temp = {
			ldsid: 'not 123', role: 'admin', fullName: 'temp'
		};
		comp.selectedUser = temp;
		adminButton.triggerEventHandler('click', {});
		expect(comp.selectedUser.role).toBe('admin');
		expect(userService.setCurrentUserSource).toHaveBeenCalledWith(temp);
	}));

	it('should delete on click', async(() => {
		spyOn(dialogService, 'hide').and.callThrough();
		fixture.detectChanges();
		expect(comp.showDeleteConfirmation).toBe(false);
		let deleteButton = fixture.debugElement.query(By.css('._delete-button'));
		deleteButton.triggerEventHandler('click', {});
		expect(dialogService.hide).not.toHaveBeenCalled();
		expect(comp.showDeleteConfirmation).toBe(true);
		deleteButton.triggerEventHandler('click', {});
		expect(dialogService.hide).toHaveBeenCalledWith(true);
	}));

	it('should hide on done click', async(() => {
		spyOn(dialogService, 'hide').and.callThrough();
		fixture.detectChanges();
		let doneButton = fixture.debugElement.query(By.css('.cancel-button'));
		doneButton.triggerEventHandler('click', {});
		expect(dialogService.hide).toHaveBeenCalledWith(false);
	}));

});








