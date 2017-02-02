/* tslint:disable:no-unused-variable */

import { inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { StatusService } from './status.service';
import { HttpServiceTestHelper } from '../../../testing/HttpServiceTestHelper';

describe('Service: User', () => {

	beforeEach(() => {
		HttpServiceTestHelper.configureTest(StatusService);
	});

	beforeEach(inject([MockBackend], function (_mockbackend: MockBackend) {
		HttpServiceTestHelper.mockbackend = _mockbackend;
	}));

	it('should test getStatuses', inject([StatusService], (service: StatusService) => {
		HttpServiceTestHelper.runTest(service, 'getStatuses');
	}));

	it('should test getStatus', inject([StatusService], (service: StatusService) => {
		HttpServiceTestHelper.runTest(service, 'getStatus', '12345');
	}));

	it('should test addStatus', inject([StatusService], (service: StatusService) => {
		HttpServiceTestHelper.runTest(service, 'addStatus', { test: 'test' });
	}));

	it('should test deleteStatus', inject([StatusService], (service: StatusService) => {
		HttpServiceTestHelper.runTest(service, 'deleteStatus', '12345');
	}));

	it('should test updateStatuses', inject([StatusService], (service: StatusService) => {
		HttpServiceTestHelper.runTest(service, 'updateStatuses', [{ test: 'test' }]);
	}));

	it('should test moveStatusIssues', inject([StatusService], (service: StatusService) => {
		HttpServiceTestHelper.runTest(service, 'moveStatusIssues', { id: '12345', moveto: '' });
		HttpServiceTestHelper.runTest(service, 'moveStatusIssues', { id: '12345', moveto: 'test' });
	}));

});


