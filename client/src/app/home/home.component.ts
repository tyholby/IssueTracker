import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/UserService/user.service';
import { StatusService } from '../services/StatusService/status.service';
import { IssueService } from '../services/IssueService/issue.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
	statuses = [];
	users = [];
	issuesLoaded = false;
	dragging: any = null;

	constructor(private userService: UserService,
				private statusService: StatusService,
				private issueService: IssueService) {
	}

	ngOnInit() {
		this.issueService.newIssueAdded$.subscribe(issue => {
			this.resetIssues();
		});
		this.userService.currentUser$.subscribe(user => {
			this.reset();
		});
		this.reset();
	}

	reset() {
		const { currentUser } = this.userService;
		if (currentUser.role !== null) {
			this.userService.getUsers().subscribe(usersResponse => {
				this.users = usersResponse.json().map(user => {
					user.expanded = false;
					return user;
				});
				if (!this.userService.isAdmin(currentUser)) {
					this.users = this.users.filter(user => user.ldsid === currentUser.ldsid);
				}
				this.resetIssues();
			});
			this.statusService.getStatuses().subscribe(statusesResponse => {
				this.statuses = statusesResponse.json();
			});
		}
	}

	resetIssues() {
		this.issuesLoaded = false;
		this.issueService.getIssues().subscribe(issuesResponse => {
			this.users.forEach(user => {
				user.issues = {};
				issuesResponse.json().forEach(issue => {
					if (user.ldsid === issue.assigneeid) {
						this.addIssueByStatus(user.issues, issue, issue.statusid);
					}
				});
			});
			this.issuesLoaded = true;
		});
	}

	addIssueByStatus(issuesObject, issue, toStatusId) {
		if (!issuesObject[toStatusId]) {
			issuesObject[toStatusId] = [];
		}
		issuesObject[toStatusId].push(issue);
	}

	allowDropFunction(userId, statusId) {
		return dragData => {
			return dragData && !(dragData.assigneeid === userId && dragData.statusid === statusId);
		};
	}

	onDragStart(issue) {
		this.dragging = issue;
	}

	onDragEnd(issue) {
		this.dragging = null;
	}

	onDropSuccess(issue, newStatusId, newUser) {
		const oldStatusId = issue.statusid;
		const oldUser = this.users.find(user => user.ldsid === issue.assigneeid);
		let newIssue = Object.assign({}, issue);
		newIssue.statusid = newStatusId;
		newIssue.assigneeid = newUser.ldsid;

		this.issueService.updateIssues([newIssue]).subscribe(issuesResponse => {
			const index = oldUser.issues[oldStatusId].indexOf(issue);
			oldUser.issues[oldStatusId].splice(index, 1);
			this.addIssueByStatus(newUser.issues, newIssue, newStatusId);
		});
	}
}
