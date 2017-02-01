import { Component, OnInit } from '@angular/core';
import { MTCDialogService } from 'mtc-modules';
import { IssueService } from '../../services/IssueService/issue.service';

@Component({
	selector: 'app-move-issues',
	templateUrl: './move-issues.component.html',
	styleUrls: ['./move-issues.component.less']
})
export class MoveIssuesComponent implements OnInit {
	statuses: Array<any> = [];
	selectedStatusId: string = '';
	showProgress: boolean = true;

	constructor(private dialogService: MTCDialogService, private issueService: IssueService) {
	}

	ngOnInit() {
		const data = this.dialogService.getData();
		this.issueService.getIssuesForStatus(data.id).subscribe(issuesResponse => {
			this.showProgress = false;
			if (issuesResponse.json().length > 0) {
				this.statuses = data.statuses.filter(s => data.id !== s.id);
			}
		});
	}

	onSubmit() {
		this.dialogService.hide(this.selectedStatusId);
	}

}
