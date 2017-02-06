import { Component, OnInit } from '@angular/core';
import { IssueService } from '../services/IssueService/issue.service';
import { UserService } from '../services/UserService/user.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.less']
})
export class CalendarComponent implements OnInit {
	allIssues = [];
	calendarOptions = null;
	searchText = '';

	constructor(private issueService: IssueService, private userService: UserService, private router: Router) {
		if (this.userService.userLoaded() && !(this.userService.isAdmin() || this.userService.isUser())) {
			this.router.navigate(['/unauth']);
			return;
		}
		this.issueService.filter$.subscribe(searchText => {
			this.searchText = searchText;
			let temp = Object.assign({}, this.calendarOptions);
			temp.events = this.allIssues.filter(this.filter.bind(this)).map(this.mapToEvent);
			this.calendarOptions = null;

			// re-render the calendar with the changes.
			const resetOptions = (newOptions) => {
				this.calendarOptions = newOptions;
			};
			setTimeout(function(){
				resetOptions(temp);
			}, 1);
		});
	}

	ngOnInit() {
		this.userService.getUsers().subscribe(userResponse => {
			this.issueService.getIssues().subscribe(issuesResponse => {
				this.allIssues = issuesResponse.json().map(i => {
					const filtered = userResponse.json().filter(u => u.ldsid === i.assigneeid);
					let assignee = {
						fullName: ''
					};
					if (filtered.length > 0) {
						assignee = filtered[0];
					}
					i.assigneeName = assignee.fullName;
					return i;
				});

				let options = {
					height: '100%',
					displayEventTime: false,
					header: {
						left:   'prev title next',
						center: '',
						right:  '',
					},
					fixedWeekCount : false,
					defaultDate: new Date(),
					editable: false,
					eventLimit: true, // allow "more" link when too many events
					events: [],
					eventClick: (event) => {
						this.issueService.openViewSideNav(event.originalIssue);
					},
				};
				options.events = this.allIssues.filter(this.filter.bind(this)).map(this.mapToEvent);
				this.calendarOptions = options;
			});
		});
	}

	mapToEvent(issue) {
		const { title, duedate } = issue;
		return {
			title,
			start: duedate,
			originalIssue: issue,
		};
	}

	filter(issue) {
		const lowercased = this.searchText.toLowerCase();
		return this.searchText === '' || issue.title.toLowerCase().includes(lowercased) || issue.assigneeName.toLowerCase().includes(lowercased);
	}

}
