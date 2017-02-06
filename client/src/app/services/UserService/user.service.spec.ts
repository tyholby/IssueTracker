/* tslint:disable:no-unused-variable */

import { inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { UserService } from './user.service';
import { HttpServiceTestHelper } from '../../../testing/HttpServiceTestHelper';

describe('Service: User', () => {

	beforeEach(() => {
		HttpServiceTestHelper.configureTest(UserService);
	});

	beforeEach(inject([MockBackend], function (_mockbackend: MockBackend) {
		HttpServiceTestHelper.mockbackend = _mockbackend;
	}));

	it('should test getUsers', inject([UserService], (service: UserService) => {
		HttpServiceTestHelper.runTest(service, 'getUsers');
	}));

	it('should test addUser', inject([UserService], (service: UserService) => {
		HttpServiceTestHelper.runTest(service, 'addUser', { test: 'test' });
	}));

	it('should test getUser', inject([UserService], (service: UserService) => {
		HttpServiceTestHelper.runTest(service, 'getUser', '123245');
	}));

	it('should test deleteUser', inject([UserService], (service: UserService) => {
		HttpServiceTestHelper.runTest(service, 'deleteUser', '12345');
	}));

	it('should test updateUser', inject([UserService], (service: UserService) => {
		HttpServiceTestHelper.runTest(service, 'updateUser', { test: 'test' });
	}));

	it('should test searchUsers', inject([UserService], (service: UserService) => {
		HttpServiceTestHelper.runTest(service, 'searchUsers', 'test');
	}));

	it('should check if user is loaded', inject([UserService], (service: UserService) => {
		expect(service.userLoaded()).toBeFalsy();
		service.currentUser = {
			ldsid: 'test',
			fulllName: 'test',
			role: 'admin',
		};
		expect(service.userLoaded()).toBeTruthy();
	}));

	it('should check type of user correctly', inject([UserService], (service: UserService) => {
		expect(service.isAdmin()).toBeFalsy();
		expect(service.isUser()).toBeFalsy();
		expect(service.isUser({role: 'user'})).toBeTruthy();
		expect(service.isAdmin({role: 'admin'})).toBeTruthy();
	}));

	it('should set current user', inject([UserService], (service: UserService) => {
		spyOn(service.currentUserChangedSource, 'next').and.callThrough();
		const user = {
			ldsid: 'test',
			fulllName: 'test',
			role: 'admin',
		};
		service.setCurrentUserSource(user);
		expect(service.currentUser.ldsid).toBe('test');
		expect(service.currentUserChangedSource.next).toHaveBeenCalledWith(user);
	}));

	it('should find unauth user', inject([UserService], (service: UserService) => {
		service.setCurrentUserSource(null);
		expect(service.unAuthUserFound).toBe(true);
	}));

	it('should set current lds user', inject([UserService], (service: UserService) => {
		spyOn(service.currentLdsAccountSource, 'next').and.callThrough();
		const user = {
			test: 'test',
		};
		service.setCurrentLdsAccountSource(user);
		expect(service.currentLdsAccountSource.next).toHaveBeenCalledWith(user);
	}));

});


