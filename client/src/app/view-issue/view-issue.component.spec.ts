/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ViewIssueComponent } from './view-issue.component';
import { IssueService } from '../services/IssueService/issue.service';
import { AttachmentService } from '../services/AttachmentService/attachment.service';
import { CommentService } from '../services/CommentService/comment.service';
import { UserService } from '../services/UserService/user.service';
import { StorageApiService, MTCDialogService, MTCCommonModule } from 'mtc-modules';
import { StatusService } from '../services/StatusService/status.service';
import { ProgressBarStubComponent } from '../../testing/material-module-stubs';
import { FormsModule } from '@angular/forms';
import { returnObserverWithCallback } from '../../testing/observerHelpers';
import { TitleCasePipe } from '../pipes/title-case/title-case.pipe';

let currentUser = { ldsid: '123', role: 'admin', fullName: 'test name' };
class UserServiceStub {
	public currentUser = currentUser;
	public getUsers() {
		return returnObserverWithCallback([currentUser], true);
	}
}

let status = {
	id: '333',
	description: 'test',
};
let issueDetails = {
	id: '111',
	title: 'title',
	description: 'desc',
	duedate: new Date(),
	attachments: [{ id: '999', filename: 'test' }],
	comments: [{
		authorid: '222',
		authorname: 'name',
		timestamp: new Date(),
		text: 'test',
	}],
	status,
	assignee: {
		ldsid: '444',
		fullName: 'full name'
	},
	createdBy: {
		ldsid: '555',
		fullName: 'full name'
	},
};
class IssueServiceStub {
	public getIssueDetails(id) {
		return returnObserverWithCallback(issueDetails, true);
	}
	public deleteIssue(id) {
		return returnObserverWithCallback({}, true);
	}
	public refreshIssues() {}
	public updateIssues(issues) {
		return returnObserverWithCallback([issueDetails], true);
	}
}

let attachment = {
	id: '666',
	url: 'url',
	issueid: issueDetails.id,
	filename: 'filename',
	attacheddate: new Date()
};
class AttachmentServiceStub {
	public addAttachments(attachments) {
		return returnObserverWithCallback([attachment], true);
	}
	public deleteAttachment(id) {
		return returnObserverWithCallback({}, true);
	}
	public onAddAttachmentClick() {}
	public openAttachment() {}
}

class StorageApiServiceStub {
	public submitFile(file) {
		return returnObserverWithCallback({ url: 'uploadDetails url' }, false);
	}
}

let comment = {
	id: '777',
	issueid: issueDetails.id,
	authorid: '888',
	text: 'comment text',
	timestamp: new Date()
};
class CommentServiceStub {
	public addComment(comment) {
		return returnObserverWithCallback(comment, true);
	}
}

let dialogConfirmed = false;
class MTCDialogServiceStub {
	public show(arg1, arg2, arg3) {
		return returnObserverWithCallback(dialogConfirmed, false);
	}
}

class StatusServiceStub {
	public getStatuses() {
		return returnObserverWithCallback([status], true);
	}
}

describe('ViewIssueComponent', () => {
	let comp: ViewIssueComponent;
	let fixture: ComponentFixture<ViewIssueComponent>;
	let issueService: IssueServiceStub;
	let attachmentService: AttachmentServiceStub;
	let storageService: StorageApiServiceStub;
	let commentService: CommentServiceStub;
	let userService: UserServiceStub;
	let dialogService: MTCDialogServiceStub;
	let statusService: StatusServiceStub;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				ViewIssueComponent, ProgressBarStubComponent, TitleCasePipe
			],
			imports: [
				FormsModule,
				MTCCommonModule,
			],
			providers: [
				{ provide:IssueService, useClass: IssueServiceStub },
				{ provide:AttachmentService, useClass:AttachmentServiceStub },
				{ provide:StorageApiService, useClass: StorageApiServiceStub },
				{ provide:CommentService, useClass:CommentServiceStub },
				{ provide:UserService, useClass:UserServiceStub },
				{ provide:MTCDialogService, useClass:MTCDialogServiceStub },
				{ provide:StatusService, useClass:StatusServiceStub },
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ViewIssueComponent);

		comp = fixture.componentInstance; // BannerComponent test instance

		issueService = fixture.debugElement.injector.get(IssueService);
		attachmentService = fixture.debugElement.injector.get(AttachmentService);
		storageService = fixture.debugElement.injector.get(StorageApiService);
		commentService = fixture.debugElement.injector.get(CommentService);
		userService = fixture.debugElement.injector.get(UserService);
		dialogService = fixture.debugElement.injector.get(MTCDialogService);
		statusService = fixture.debugElement.injector.get(StatusService);
	});

	it('should set users, statuses, and issueDetails on init', async(() => {
		comp.data = {
			id: '123'
		};
		comp.ngOnChanges({});
		/*
		 fixture.detectChanges doesn't call ngOnChanges, so I need to call it manually.
		 There is an open issue about it on github: https://github.com/angular/angular/issues/9866
		 I talked about this problem with Matt and he cleared me on it.
		 */
		fixture.detectChanges();
		expect(comp.statuses[0].id).toBe(status.id);
		expect(comp.users[0].ldsid).toBe(currentUser.ldsid);
		expect(comp.issueDetails.id).toBe(issueDetails.id);
	}));

	it('should add attachment on file select', async(() => {
		spyOn(attachmentService, 'addAttachments').and.callThrough();
		comp.data = {
			id: '123'
		};
		comp.ngOnChanges({});
		fixture.detectChanges();
		let fileInput = fixture.debugElement.query(By.css('#input-file-issue-details'));

		let blob = new Blob([''], { type: 'text/html' });
		blob['lastModified'] = new Date();
		blob['name'] = 'filename';
		let fakeF = <File>blob;

		fileInput.triggerEventHandler('change', {
			target: {
				files: []
			}
		});
		expect(attachmentService.addAttachments).not.toHaveBeenCalled();
		fileInput.triggerEventHandler('change', {
			target: {
				files: [fakeF]
			}
		});
		// we have a reader.onload, so we need a time out.
		setTimeout(function(){
			expect(attachmentService.addAttachments).toHaveBeenCalled();
		}, 1);
	}));

	it('should remove attachment on click', async(() => {
		spyOn(attachmentService, 'deleteAttachment').and.callThrough();
		comp.data = {
			id: '123'
		};
		const { id, title, description, duedate } = issueDetails;
		comp.editCopy = {
			id,
			title,
			description,
			duedate,
			statusid: issueDetails.status.id,
			assigneeid: issueDetails.assignee.ldsid,
			createdbyid: issueDetails.createdBy.ldsid,
		};
		comp.ngOnChanges({});
		fixture.detectChanges();
		let removeButton = fixture.debugElement.query(By.css('.remove-attachment-button'));
		removeButton.triggerEventHandler('click', {});
		expect(attachmentService.deleteAttachment).toHaveBeenCalledWith('999');
	}));

	it('should call add comment on click', async(() => {
		spyOn(commentService, 'addComment').and.callThrough();
		comp.data = {
			id: '123'
		};
		comp.ngOnChanges({});
		fixture.detectChanges();
		let addCommentButton = fixture.debugElement.query(By.css('._add-comment-button'));
		addCommentButton.triggerEventHandler('click', {});
		expect(commentService.addComment).toHaveBeenCalled();
	}));

	it('should call delete issue on click', async(() => {
		spyOn(issueService, 'deleteIssue').and.callThrough();
		spyOn(issueService, 'refreshIssues').and.callThrough();
		comp.data = {
			id: '123'
		};
		comp.ngOnChanges({});
		fixture.detectChanges();
		let deleteIssueButton = fixture.debugElement.query(By.css('._delete-issue-button'));
		deleteIssueButton.triggerEventHandler('click', {});
		expect(issueService.deleteIssue).not.toHaveBeenCalled();
		expect(issueService.refreshIssues).not.toHaveBeenCalled();
		dialogConfirmed = true;
		deleteIssueButton.triggerEventHandler('click', {});
		expect(issueService.deleteIssue).toHaveBeenCalledWith(issueDetails.id);
		expect(issueService.refreshIssues).toHaveBeenCalled();
		dialogConfirmed = false;
	}));

	it('should edit issue on click', async(() => {
		comp.data = {
			id: '123'
		};
		comp.ngOnChanges({});
		fixture.detectChanges();
		expect(comp.editCopy).toBe(null);
		let editIssueButton = fixture.debugElement.query(By.css('._edit-save-button'));
		editIssueButton.triggerEventHandler('click', {});
		expect(comp.editCopy).not.toBe(null);
	}));

	it('should save issue on click', async(() => {
		spyOn(issueService, 'refreshIssues').and.callThrough();
		comp.data = {
			id: '123'
		};
		const { id, title, description, duedate } = issueDetails;
		comp.editCopy = {
			id,
			title,
			description,
			duedate,
			statusid: issueDetails.status.id,
			assigneeid: issueDetails.assignee.ldsid,
			createdbyid: issueDetails.createdBy.ldsid,
		};
		comp.ngOnChanges({});
		fixture.detectChanges();
		expect(comp.editCopy).not.toBe(null);
		let editIssueButton = fixture.debugElement.query(By.css('._edit-save-button'));
		editIssueButton.triggerEventHandler('click', {});
		expect(comp.editCopy).toBe(null);
		expect(issueService.refreshIssues).toHaveBeenCalled();
	}));
});








