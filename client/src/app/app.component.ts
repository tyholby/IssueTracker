import { Component, OnInit } from '@angular/core';
import { MTCUser } from 'mtc-modules';
import { UserService } from './services/UserService/user.service';

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

	constructor(private MTCUser: MTCUser, private userService: UserService){

	}

	ngOnInit() {
		this.MTCUser.getUser().subscribe((ldsAccount) => {
			console.log('MTCUser.getUser()', ldsAccount);
			this.userService.currentLdsAccount = ldsAccount;
			this.userService.getUser(ldsAccount.id).subscribe((userResponse) => {
				this.userService.currentUser = userResponse.json();
			});
		});
	}

	logout() {
		MTCAuth.logout();
		this.userService.currentLdsAccount = {};
		this.userService.currentUser = {
			role: null
		};
	}

}




// onGetUsersClick() {
// 	this.userService.getUsers().subscribe((usersResponse) => {
// 		console.log('usersResponse.json()', usersResponse.json());
// 		this.users = usersResponse.json();
// 	});
// }
// onAddUsersClick() {
// 	this.userService.addUser({ fullName: 'test', ldsid: 12344, role: 'test' }).subscribe((usersResponse) => {
// 		console.log('usersResponse.json()', usersResponse.json());
// 	});
// }
// onDeleteUsersClick() {
// 	this.userService.deleteUser(12344).subscribe((usersResponse) => {
// 		console.log('usersResponse.json()', usersResponse.json());
// 	});
// }
// onUpdateUsersClick() {
// 	this.userService.updateUser({ fullName: 'changed', ldsid: 12344, role: 'test' }).subscribe((usersResponse) => {
// 		console.log('usersResponse.json()', usersResponse.json());
// 	});
// }