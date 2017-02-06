import { Component, Input } from '@angular/core';
import { IssueService } from '../../../services/IssueService/issue.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: 'sidebar.component.html',
	styleUrls: ['sidebar.component.less']
})
export class SidebarComponent {
	@Input() isAuthorized: boolean;
	routes: any[];
	active = '';

	constructor(private issueService: IssueService) {
		this.routes = [
			{url: '', name:'Board'},
			{url: 'permissions', name:'Permissions'},
			{url: 'calendar', name:'Calendar'},
		];
	}

	createNewIssue() {
		this.issueService.openCreateSideNav();
	}
}
