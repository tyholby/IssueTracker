import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/UserService/user.service';
import { MTCDialogService, SimpleConfirmationComponent } from 'mtc-modules';
import { NewUserComponent } from './new-user/new-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { StatusService } from '../services/StatusService/status.service';
import { NewStatusComponent } from './new-status/new-status.component';

@Component({
	selector: 'app-permissions',
	templateUrl: './permissions.component.html',
	styleUrls: ['./permissions.component.less']
})
export class PermissionsComponent implements OnInit {
	admins: Array<any>;
	users: Array<any>;
	statuses: Array<any>;
	editStatuses: boolean;

	constructor(private userService: UserService, private statusService: StatusService, private dialogService: MTCDialogService) {
		this.admins = [];
		this.users = [];
		this.statuses = [];
		this.editStatuses = false;
	}

	ngOnInit() {
		this.resetUsers();
		this.resetStatuses();
	}

	resetUsers() {
		this.userService.getUsers().subscribe((usersResponse) => {
			this.admins = usersResponse.json().filter(u => {
				return u.role === 'admin';
			});
			this.users = usersResponse.json().filter(u => {
				return u.role === 'user';
			});
		});
	}

	resetStatuses() {
		this.statusService.getStatuses().subscribe((statusesResponse) => {
			this.statuses = statusesResponse.json();
		});
	}

	fixStatusOrders() {
		this.statuses.forEach((status, i) => {
			status.ordernum = i + 1;
			status.edited = true;
		});
		this.saveStatuses();
	}

	onAddUserClick() {
		this.dialogService.show(NewUserComponent, 350, 200).subscribe(newUser => {
			if (newUser) {
				this.resetUsers();
			}
		});
	}

	onEditUser(user) {
		this.dialogService.show(EditUserComponent, 350, 200, user).subscribe(updatedUser => {
			if (updatedUser) {
				this.resetUsers();
			}
		});
	}

	onAddStatusClick() {
		this.dialogService.show(NewStatusComponent, 350, 200, this.statuses.length + 1).subscribe(newStatus => {
			if (newStatus) {
				this.resetStatuses();
			}
		});
	}

	onDeleteStatus(status) {
		this.dialogService.show(SimpleConfirmationComponent, 350, 200).subscribe(deletedStatus => {
			if (deletedStatus) {
				this.statusService.deleteStatus(status.id).subscribe(response => {
					this.resetStatuses();
					this.fixStatusOrders();
				});
			}
		});
	}

	onEditStatusesClick() {
		this.editStatuses = !this.editStatuses;
	}

	saveStatuses() {
		let toUpdate = 0;
		this.statuses.forEach(status => {
			if (status.edited) {
				delete status.edited;
				toUpdate++;
				this.statusService.updateStatus(status).subscribe(response => {
					toUpdate--;
					if (toUpdate >= 0) {
						if (this.editStatuses) {
							this.editStatuses = false;
						}
						this.resetStatuses();
					}
				});
			}
		});
	}

}
