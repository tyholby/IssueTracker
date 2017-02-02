/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MTCDialogService, MTCCommonModule } from 'mtc-modules';
import { ProgressBarStubComponent } from '../../../testing/material-module-stubs';
import { FormsModule } from '@angular/forms';
import { NewUserComponent } from './new-user.component';
import { UserService } from '../../services/UserService/user.service';
import { returnObserverWithCallback } from '../../../testing/observerHelpers';

class UserServiceStub {
	public addUser(user) {
		return returnObserverWithCallback({}, false);
	}
	public searchUsers(text) {
		return returnObserverWithCallback([
			{
				ldsId: '124325',
				restOfName: 'wer',
				surName: 'sdf',
			}
		], true);
	}
}

class MTCDialogServiceStub {
	public hide(data) {}
}

describe('NewUserComponent', () => {
	let comp: NewUserComponent;
	let fixture: ComponentFixture<NewUserComponent>;
	let userService: UserServiceStub;
	let dialogService: MTCDialogServiceStub;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				NewUserComponent, ProgressBarStubComponent
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
		fixture = TestBed.createComponent(NewUserComponent);

		comp = fixture.componentInstance; // BannerComponent test instance

		userService = fixture.debugElement.injector.get(UserService);
		dialogService = fixture.debugElement.injector.get(MTCDialogService);
	});

	it('should search users on key up', async(() => {
		fixture.detectChanges();
		let searchInput = fixture.debugElement.query(By.css('._search-accounts'));
		searchInput.triggerEventHandler('keyup', {});
		expect(comp.searchResults.length).toBe(0);
		comp.searchText = 'test';
		searchInput.triggerEventHandler('keyup', {});
		expect(comp.searchResults.length).toBe(1);
		expect(comp.searchResults[0].ldsid).toBe('124325');

		fixture.detectChanges();
		expect(comp.selectedUser).toBe(null);
		let resultSelector = fixture.debugElement.query(By.css('._result-selector'));
		resultSelector.triggerEventHandler('click', {});
		expect(comp.selectedUser.ldsid).toBe('124325');
		expect(comp.searchResults.length).toBe(0);
	}));

	it('should set role on click', async(() => {
		fixture.detectChanges();
		comp.selectedUser = {
			role: 'test'
		};
		fixture.detectChanges();
		let adminButton = fixture.debugElement.query(By.css('._admin-role-selector'));
		let userButton = fixture.debugElement.query(By.css('._user-role-selector'));
		adminButton.triggerEventHandler('click', {});
		expect(comp.selectedUser.role).toBe('admin');
		userButton.triggerEventHandler('click', {});
		expect(comp.selectedUser.role).toBe('user');
	}));

	it('should submit and cancel on click', async(() => {
		spyOn(dialogService, 'hide').and.callThrough();
		fixture.detectChanges();
		comp.selectedUser = {
			role: 'test'
		};
		fixture.detectChanges();
		let submitButton = fixture.debugElement.query(By.css('._submit-button'));
		let cancelButton = fixture.debugElement.query(By.css('.cancel-button'));
		submitButton.triggerEventHandler('click', {});
		expect(comp.showProgress).toBe(true);
		expect(dialogService.hide).toHaveBeenCalledWith(true);
		cancelButton.triggerEventHandler('click', {});
		expect(dialogService.hide).toHaveBeenCalledWith(false);
	}));

});








