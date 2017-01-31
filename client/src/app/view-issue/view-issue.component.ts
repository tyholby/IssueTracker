import { Component, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { IssueService } from '../services/IssueService/issue.service';
import { AttachmentService } from '../services/AttachmentService/attachment.service';
import { StorageApiService, MTCDialogService, SimpleConfirmationComponent } from 'mtc-modules';
import { CommentService } from '../services/CommentService/comment.service';
import { UserService } from '../services/UserService/user.service';
import { StatusService } from '../services/StatusService/status.service';

@Component({
	selector: 'app-view-issue',
	templateUrl: './view-issue.component.html',
	styleUrls: ['./view-issue.component.less']
})
export class ViewIssueComponent implements OnChanges {
	@Output() onClose: EventEmitter<any>;
	@Input() data: any;
	issueDetails: any;
	newComment: string;
	editCopy: any;
	statuses: Array<any>;
	users: Array<any>;

	constructor(private issueService: IssueService, private attachmentService: AttachmentService,
				private storageService: StorageApiService, private commentService: CommentService,
				private userService: UserService, private dialogService: MTCDialogService,
				private statusService: StatusService) {
		this.onClose = new EventEmitter<any>();
		this.newComment = '';
		this.editCopy = null;
		this.statuses = [];
		this.users = [];
	}

	ngOnChanges(changes) {
		this.reset(this.data.id);
	}

	reset(id) {
		this.issueService.getIssueDetails(id).subscribe(issueDataResponse => {
			this.issueDetails = issueDataResponse.json();
		});
		this.statusService.getStatuses().subscribe(statusResponse => {
			this.statuses = statusResponse.json();
		});
		this.userService.getUsers().subscribe(usersResponse => {
			this.users = usersResponse.json();
		});
	}

	onFileSelected(event) {
		let file = event.target.files[0];
		let reader = new FileReader();
		reader.onload = (e: any) => {
			this.storageService.submitFile(file).subscribe((uploadDetails) => {
				// ----- uploadDetails looks like this:
				// {
				// 	extension: ".jpg",
				// 		mimeType: "image/jpeg",
				// 	sha1: "kBWpRHvSHhQfS33jpQaZXNB0JhI=",
				// 	url: "https://cdn.mtc.byu.edu/storage/5ad9e458-a4f9-4252-b6aa-b6be8305762f/dev/e53b3810-2856-4e26-b7ab-4867420491c2.jpg"
				// }
				// ------
				let attachment = {
					id: null,
					url: uploadDetails.url,
					issueid: this.issueDetails.id,
					filename: file.name,
					attacheddate: file.lastModified
				};
				this.attachmentService.addAttachments([attachment]).subscribe(attachmentsResponse => {
					this.issueDetails.attachments.push(attachmentsResponse.json()[0]);
				});
			});
		};
		if (file) {
			reader.readAsDataURL(file);
		}
	}

	onRemoveAttachment(attachment, i) {
		this.attachmentService.deleteAttachment(attachment.id).subscribe(removeResponse => {
			this.issueDetails.attachments.splice(i, 1);
		});
	}

	onNewCommentSubmit() {
		const comment = {
			id: null,
			issueid: this.issueDetails.id,
			authorid: this.userService.currentUser.ldsid,
			text: this.newComment,
			timestamp: new Date()
		};
		this.newComment = '';
		this.commentService.addComment(comment).subscribe(commentResponse => {
			this.issueDetails.comments.push(commentResponse.json());
		});
	}

	onDeleteIssue() {
		this.dialogService.show(SimpleConfirmationComponent, 350, 200).subscribe(shouldDelete => {
			if (shouldDelete) {
				this.issueService.deleteIssue(this.issueDetails.id).subscribe(deleteResponse => {
					this.onClose.emit();
					this.issueService.refreshIssues();
				});
			}
		});
	}

	onEdit() {
		const { id, title, description, duedate } = this.issueDetails;
		this.editCopy = {
			id,
			title,
			description,
			duedate,
			statusid: this.issueDetails.status.id,
			assigneeid: this.issueDetails.assignee.ldsid,
			createdbyid: this.issueDetails.createdBy.ldsid,
		};
	}

	onSaveEdit() {
		this.issueService.updateIssues([this.editCopy]).subscribe(issuesResponse => {
			this.editCopy = null;
			this.reset(issuesResponse.json()[0].id);
			this.issueService.refreshIssues();
		});
	}
}
