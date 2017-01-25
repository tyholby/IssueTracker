import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/UserService/user.service';
import { MTCDialogService } from 'mtc-modules';
import { NewUserComponent } from './new-user/new-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

@Component({
	selector: 'app-permissions',
	templateUrl: './permissions.component.html',
	styleUrls: ['./permissions.component.less']
})
export class PermissionsComponent implements OnInit {
	admins: Array<any>;
	users: Array<any>;

	constructor(private userService: UserService, private dialogService: MTCDialogService) {
		this.admins = [];
		this.users = [];
	}

	ngOnInit() {
		this.reset();
	}

	reset() {
		this.userService.getUsers().subscribe((usersResponse) => {
			this.admins = usersResponse.json().filter(u => {
				return u.role === 'admin';
			});
			this.users = usersResponse.json().filter(u => {
				return u.role === 'user';
			});
		});
	}

	onAddUserClick() {
		this.dialogService.show(NewUserComponent, 350, 200).subscribe(newUser => {
			if (newUser) {
				this.reset();
			}
		});
	}

	onEdit(user) {
		this.dialogService.show(EditUserComponent, 350, 200, user).subscribe(updatedUser => {
			if (updatedUser) {
				this.reset();
			}
		});
	}

}
