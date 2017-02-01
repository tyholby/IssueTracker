import { Component, OnInit } from '@angular/core';
import { MTCUser } from 'mtc-modules';
import { UserService } from './services/UserService/user.service';
import { IssueService } from './services/IssueService/issue.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
	authorized: boolean = true;
	toastOptions = {
		position: ['bottom', 'right'],
		timeOut: 4000,
		showProgressBar: false,
		animate: 'fromLeft'
	};
	username = '';
	searchText = '';
	createIssueData = null;
	viewIssueData = null;

	constructor(private MTCUser: MTCUser, private userService: UserService, private issueService: IssueService, private router: Router){

	}

	ngOnInit() {
		this.issueService.openCreateSideNav$.subscribe(() => {
			this.createIssueData = this.userService.currentUser;
			this.viewIssueData = null;
		});
		this.issueService.openViewSideNav$.subscribe(data => {
			this.viewIssueData = data;
			this.createIssueData = null;
		});
		this.userService.currentLdsAccount$.subscribe(account => this.username = account.name);
		this.MTCUser.getUser().subscribe((ldsAccount) => {
			console.log('MTCUser.getUser()', ldsAccount);
			this.userService.setCurrentLdsAccountSource(ldsAccount);
			this.userService.getUser(ldsAccount.id).subscribe((userResponse) => {
				this.userService.setCurrentUserSource(userResponse.json());
				if (!(this.userService.isAdmin() || this.userService.isUser())) {
					this.router.navigate(['/unauth'])
				}
			});
		});
	}

	filter() {
		this.issueService.filter(this.searchText);
	}

	logout() {
		MTCAuth.logout();
	}

}
