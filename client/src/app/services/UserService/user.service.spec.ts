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
		HttpServiceTestHelper.runTest(service,'getUsers');
	}));

	it('should test addUser', inject([UserService], (service: UserService) => {
		HttpServiceTestHelper.runTest(service,'addUser', {test: 'test'});
	}));

	it('should test deleteUser', inject([UserService], (service: UserService) => {
		HttpServiceTestHelper.runTest(service,'deleteUser', '12345');
	}));

	it('should test updateUser', inject([UserService], (service: UserService) => {
		HttpServiceTestHelper.runTest(service,'updateUser', {test: 'test'});
	}));
});
