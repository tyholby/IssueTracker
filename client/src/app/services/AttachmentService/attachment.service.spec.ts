/* tslint:disable:no-unused-variable */

import { inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { AttachmentService } from './attachment.service';
import { HttpServiceTestHelper } from '../../../testing/HttpServiceTestHelper';

describe('Service: User', () => {

	beforeEach(() => {
		HttpServiceTestHelper.configureTest(AttachmentService);
	});

	beforeEach(inject([MockBackend], function (_mockbackend: MockBackend) {
		HttpServiceTestHelper.mockbackend = _mockbackend;
	}));

	it('should test getAttachmentsByIssueId', inject([AttachmentService], (service: AttachmentService) => {
		HttpServiceTestHelper.runTest(service, 'getAttachmentsByIssueId', '12324');
	}));

	it('should test addAttachments', inject([AttachmentService], (service: AttachmentService) => {
		HttpServiceTestHelper.runTest(service, 'addAttachments', { test: 'test' });
	}));

	it('should test deleteAttachment', inject([AttachmentService], (service: AttachmentService) => {
		HttpServiceTestHelper.runTest(service, 'deleteAttachment', '123245');
	}));

	it('should test updateAttachments', inject([AttachmentService], (service: AttachmentService) => {
		HttpServiceTestHelper.runTest(service, 'updateAttachments', { test: 'test' });
	}));

	it('should open attachment and click add attachment element', inject([AttachmentService], (service: AttachmentService) => {
		const elId = 'test';
		let dummyElement = document.createElement('div');
		dummyElement.id = elId;
		document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);
		service.openAttachment({ url: 'test' });
		service.onAddAttachmentClick(elId);
		expect(document.getElementById).toHaveBeenCalledWith(elId);
	}));

});


