import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/UserService/user.service';
import { StatusService } from '../services/StatusService/status.service';
import { IssueService } from '../services/IssueService/issue.service';
import { Router } from '@angular/router';

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
	searchText: string = '';

	constructor(private userService: UserService,
				private statusService: StatusService,
				private issueService: IssueService,
				private router: Router) {
		this.issueService.filter$.subscribe(searchText => {
			this.searchText = searchText;
		});
	}

	ngOnInit() {
		if (this.userService.userLoaded() && !(this.userService.isAdmin() || this.userService.isUser())) {
			this.router.navigate(['/unauth'])
		}
		this.issueService.refreshIssues$.subscribe(issue => {
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
			let issues = issuesResponse.json().map(i => {
				const filtered = this.users.filter(u => u.ldsid === i.assigneeid);
				let assignee = {
					fullName: ''
				};
				if (filtered.length > 0) {
					assignee = filtered[0];
				}
				i.assigneeName = assignee.fullName;
				return i;
			});
			this.users.forEach(user => {
				user.issues = {};
				issues.forEach(issue => {
					if (user.ldsid === issue.assigneeid) {
						this.addIssueByStatus(user.issues, issue, issue.statusid);
					}
				});
			});
			this.issuesLoaded = true;
		});
	}

	filter(issue) {
		const lowercased = this.searchText.toLowerCase();
		return this.searchText === '' || issue.title.toLowerCase().includes(lowercased) || issue.assigneeName.toLowerCase().includes(lowercased)
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
