import { Component, OnInit } from '@angular/core';
import { MTCUser } from 'mtc-modules';

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
	user: any = null;

	constructor(private MTCUser: MTCUser){

	}

	ngOnInit() {
		this.MTCUser.getUser().subscribe((user) => {
			console.log('MTCUser.getUser()', user);
			this.user = user;
		});
	}

	logout() {
		MTCAuth.logout();
	}

}
