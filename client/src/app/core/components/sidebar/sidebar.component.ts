import { Component } from '@angular/core';
import { IssueService } from '../../../services/IssueService/issue.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: 'sidebar.component.html',
	styleUrls: ['sidebar.component.less']
})
export class SidebarComponent {
	routes: any[];
	active = 'Board';

	constructor(private issueService: IssueService) {
		this.routes = [
			{url: '', name:'Board'},
			{url: 'permissions', name:'Permissions'},
		];
	}

	createNewIssue() {
		this.issueService.openCreateSideNav();
	}
}
