/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CreateIssueComponent } from './create-issue.component';
import { IssueService } from '../services/IssueService/issue.service';
import { AttachmentService } from '../services/AttachmentService/attachment.service';
import { UserService } from '../services/UserService/user.service';
import { StorageApiService, MTCCommonModule } from 'mtc-modules';
import { StatusService } from '../services/StatusService/status.service';
import { ProgressBarStubComponent } from '../../testing/material-module-stubs';
import { FormsModule } from '@angular/forms';
import { returnObserverWithCallback } from '../../testing/observerHelpers';

let attachment = {
	id: 'attachmentid',
	url: 'this/is/a/url',
	issueid: 'issueid',
	attacheddate: new Date(),
	filename: 'filename',
};
class AttachmentServiceStub {
	public addAttachments(attachments) {
		return returnObserverWithCallback([attachment], true);
	}
	public onAddAttachmentClick() {}
	public openAttachment() {}
}

class StatusServiceStub {
	public getStatuses() {
		return returnObserverWithCallback([{
			id: 'statusid',
			description: 'test status',
		}], true);
	}
}

class StorageApiServiceStub {
	public submitFile(file) {
		return returnObserverWithCallback({ url: 'uploadDetails url' }, false);
	}
}

let currentUser = { ldsid: '123', role: 'admin', fullName: 'test name' };
class UserServiceStub {
	public currentUser = currentUser;
	public getUsers() {
		return returnObserverWithCallback([currentUser], true);
	}
}

class IssueServiceStub {
	public refreshIssues() {}
	public addIssue(issue) {
		return returnObserverWithCallback({
			id: 'issueid',
			title: 'title',
			description: 'desc',
			duedate: new Date(),
			assigneeid: '123',
			statusid: 'statusid',
			createdbyid: '123',
		}, true);
	}
}

describe('CreateIssueComponent', () => {
	let comp: CreateIssueComponent;
	let fixture: ComponentFixture<CreateIssueComponent>;
	let issueService: IssueServiceStub;
	let attachmentService: AttachmentServiceStub;
	let storageService: StorageApiServiceStub;
	let userService: UserServiceStub;
	let statusService: StatusServiceStub;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				CreateIssueComponent, ProgressBarStubComponent
			],
			imports: [
				FormsModule,
				MTCCommonModule,
			],
			providers: [
				{ provide:IssueService, useClass: IssueServiceStub },
				{ provide:AttachmentService, useClass:AttachmentServiceStub },
				{ provide:StorageApiService, useClass: StorageApiServiceStub },
				{ provide:UserService, useClass:UserServiceStub },
				{ provide:StatusService, useClass:StatusServiceStub },
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CreateIssueComponent);

		comp = fixture.componentInstance; // BannerComponent test instance

		issueService = fixture.debugElement.injector.get(IssueService);
		attachmentService = fixture.debugElement.injector.get(AttachmentService);
		storageService = fixture.debugElement.injector.get(StorageApiService);
		userService = fixture.debugElement.injector.get(UserService);
		statusService = fixture.debugElement.injector.get(StatusService);
	});

	it('should set users, statuses, and issue on init', async(() => {
		comp.createdBy = Object.assign({}, currentUser);
		fixture.detectChanges();
		expect(comp.issue.id).toBe(null);
		expect(comp.users[0].ldsid).toBe('123');
		expect(comp.statuses[0].id).toBe('statusid');
	}));

	it('should add attachment on file select', async(() => {
		comp.createdBy = Object.assign({}, currentUser);
		fixture.detectChanges();
		let fileInput = fixture.debugElement.query(By.css('#input-file'));

		let blob = new Blob([''], { type: 'text/html' });
		blob['lastModified'] = new Date();
		blob['name'] = 'filename';
		let fakeF = <File>blob;

		fileInput.triggerEventHandler('change', {
			target: {
				files: []
			}
		});
		expect(comp.attachments.length).toBe(0);
		fileInput.triggerEventHandler('change', {
			target: {
				files: [fakeF]
			}
		});
		// we have a reader.onload, so we need a time out.
		setTimeout(function(){
			expect(comp.attachments.length).toBe(1);
		}, 1);
	}));

	it('should save new issue on submit', async(() => {
		comp.createdBy = Object.assign({}, currentUser);
		fixture.detectChanges();
		spyOn(issueService, 'refreshIssues').and.callThrough();
		spyOn(comp.onClose, 'emit');
		comp.attachments = [attachment];
		let submitIssueButton = fixture.debugElement.query(By.css('._submit-button'));
		submitIssueButton.triggerEventHandler('click', {});
		expect(comp.onClose.emit).toHaveBeenCalled();
		expect(issueService.refreshIssues).toHaveBeenCalled();
	}));

});








