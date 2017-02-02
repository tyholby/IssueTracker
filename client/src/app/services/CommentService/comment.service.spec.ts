/* tslint:disable:no-unused-variable */

import { inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { CommentService } from './comment.service';
import { HttpServiceTestHelper } from '../../../testing/HttpServiceTestHelper';

describe('Service: User', () => {

	beforeEach(() => {
		HttpServiceTestHelper.configureTest(CommentService);
	});

	beforeEach(inject([MockBackend], function (_mockbackend: MockBackend) {
		HttpServiceTestHelper.mockbackend = _mockbackend;
	}));

	it('should test getCommentsByIssueId', inject([CommentService], (service: CommentService) => {
		HttpServiceTestHelper.runTest(service, 'getCommentsByIssueId', '123245');
	}));

	it('should test addComment', inject([CommentService], (service: CommentService) => {
		HttpServiceTestHelper.runTest(service, 'addComment', { test: 'test' });
	}));

	it('should test deleteComment', inject([CommentService], (service: CommentService) => {
		HttpServiceTestHelper.runTest(service, 'deleteComment', '123245');
	}));

	it('should test updateComment', inject([CommentService], (service: CommentService) => {
		HttpServiceTestHelper.runTest(service, 'updateComment', { test: 'test' });
	}));

});


