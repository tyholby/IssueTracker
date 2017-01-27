import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UserService } from '../services/UserService/user.service';
import { IssueService } from '../services/IssueService/issue.service';
import { StorageApiService } from 'mtc-modules';
import { AttachmentService } from '../services/AttachmentService/attachment.service';

@Component({
	selector: 'app-create-issue',
	templateUrl: 'create-issue.component.html',
	styleUrls: ['create-issue.component.less']
})
export class CreateIssueComponent implements OnInit {
	@Output() onClose: EventEmitter<any>;
	@Input() createdBy: any;
	issue: any = null;
	users: Array<any>;
	attachments: Array<any>;
	saving: boolean;
	fileUploading: boolean;

	constructor(private userService: UserService, private issueService: IssueService, private storageService: StorageApiService,
				private attachmentService: AttachmentService) {
		this.onClose = new EventEmitter<any>();
		this.users = [];
		this.attachments = [];
		this.saving = false;
		this.fileUploading = false;
	}

	ngOnInit() {
		this.userService.getUsers().subscribe(usersResponse => {
			this.users = usersResponse.json();
			this.issue = {
				id: null, // set in backend
				statusid: null, // set in backend
				title: '',
				description: '',
				duedate: new Date(),
				assigneeid: '',
				createdbyid: this.createdBy.ldsid
			};
		});
	}

	onAddAttachmentClick() {
		document.getElementById('input-file').click();
	}

	onFileSelected(event) {
		this.fileUploading = true;
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
					issueid: null,
					filename: file.name,
					attacheddate: file.lastModified
				};
				this.attachments.push(attachment);
				this.fileUploading = false;
			});
		};
		if (file) {
			reader.readAsDataURL(file);
		}
	}

	onSubmit() {
		this.saving = true;
		this.issueService.addIssue(this.issue).subscribe(issueResponse => {
			const newIssue = issueResponse.json();
			this.issueService.newIssueAdded(newIssue);
			this.attachmentService.addAttachments(this.attachments.map(a => {
				a.issueid = newIssue.id;
			})).subscribe(attachmentsResponse => {
				console.log('attachmentsResponse', attachmentsResponse.json())
				//TODO the addAttachments call is breaking.
				//TODO When clicking on the saved file, it should download to my computer.
				this.saving = false;
				this.onClose.emit();
			});
		});
	}
}
