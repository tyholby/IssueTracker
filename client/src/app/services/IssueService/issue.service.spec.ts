/* tslint:disable:no-unused-variable */

import { inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { IssueService } from './issue.service';
import { HttpServiceTestHelper } from '../../../testing/HttpServiceTestHelper';

describe('Service: User', () => {

	beforeEach(() => {
		HttpServiceTestHelper.configureTest(IssueService);
	});

	beforeEach(inject([MockBackend], function (_mockbackend: MockBackend) {
		HttpServiceTestHelper.mockbackend = _mockbackend;
	}));

	it('should test getIssues', inject([IssueService], (service: IssueService) => {
		HttpServiceTestHelper.runTest(service, 'getIssues');
	}));

	it('should test getIssueDetails', inject([IssueService], (service: IssueService) => {
		HttpServiceTestHelper.runTest(service, 'getIssueDetails', '123245');
	}));

	it('should test getIssuesForStatus', inject([IssueService], (service: IssueService) => {
		HttpServiceTestHelper.runTest(service, 'getIssuesForStatus', '123245');
	}));

	it('should test addIssue', inject([IssueService], (service: IssueService) => {
		HttpServiceTestHelper.runTest(service, 'addIssue', { test: 'test' });
	}));

	it('should test deleteIssue', inject([IssueService], (service: IssueService) => {
		HttpServiceTestHelper.runTest(service, 'deleteIssue', '213245');
	}));

	it('should test updateIssues', inject([IssueService], (service: IssueService) => {
		HttpServiceTestHelper.runTest(service, 'updateIssues', [{ id: 'test', assigneeName: 'name'}]);
	}));

	it('should open CreateSideNav', inject([IssueService], (service: IssueService) => {
		spyOn(service.openCreateSideNavSource, 'next').and.callThrough();
		service.openCreateSideNav();
		expect(service.openCreateSideNavSource.next).toHaveBeenCalled();
	}));

	it('should open ViewSideNav', inject([IssueService], (service: IssueService) => {
		spyOn(service.openViewSideNavSource, 'next').and.callThrough();
		const issue = {
			test: 'test',
		};
		service.openViewSideNav(issue);
		expect(service.openViewSideNavSource.next).toHaveBeenCalledWith(issue);
	}));

	it('should refresh Issues', inject([IssueService], (service: IssueService) => {
		spyOn(service.refreshIssuesSource, 'next').and.callThrough();
		service.refreshIssues();
		expect(service.refreshIssuesSource.next).toHaveBeenCalled();
	}));

	it('should filter', inject([IssueService], (service: IssueService) => {
		spyOn(service.filterSource, 'next').and.callThrough();
		service.filter('test');
		expect(service.filterSource.next).toHaveBeenCalledWith('test');
	}));

});


