import { Component } from '@angular/core';

@Component({
	selector: 'app-sidebar',
	templateUrl: 'sidebar.component.html',
	styleUrls: ['sidebar.component.less']
})
export class SidebarComponent {
	routes: any[];
	active = 'Board';

	constructor() {
		this.routes = [
			{url: '', name:'Board'},
			{url: 'permissions', name:'Permissions'},
		];
	}
}
