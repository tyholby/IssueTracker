import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/UserService/user.service';
import { MTCDialogService } from 'mtc-modules';
import { NewUserComponent } from './new-user/new-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { StatusService } from '../services/StatusService/status.service';
import { NewStatusComponent } from './new-status/new-status.component';
import { Router } from '@angular/router';
import { MoveIssuesComponent } from './move-issues/move-issues.component';
import { NotificationsService } from 'angular2-notifications';

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

	constructor(private userService: UserService, private statusService: StatusService,
				private dialogService: MTCDialogService, private router: Router, private notificationsService: NotificationsService) {
		this.admins = [];
		this.users = [];
		this.statuses = [];
		this.editStatuses = false;
	}

	ngOnInit() {
		if (this.userService.userLoaded() && !(this.userService.isAdmin() || this.userService.isUser())) {
			this.router.navigate(['/unauth']);
			return;
		}
		this.userService.currentUser$.subscribe(user => {
			this.resetUsers();
			this.resetStatuses();
		});
		this.resetUsers();
		this.resetStatuses();
	}

	resetUsers() {
		const { currentUser } = this.userService;
		if (currentUser.role !== null) {
			this.userService.getUsers().subscribe((usersResponse) => {
				this.admins = usersResponse.json().filter(u => {
					return u.role === 'admin' && u.ldsid !== 'Unassigned';
				});
				this.users = usersResponse.json().filter(u => {
					return u.role === 'user';
				});
			});
		}
	}

	resetStatuses() {
		this.statusService.getStatuses().subscribe((statusesResponse) => {
			this.statuses = statusesResponse.json();
		});
	}

	fixStatusOrders() {
		this.statuses.forEach((status, i) => {
			const newOrdernum = i + 1;
			if (status.ordernum !== newOrdernum) {
				status.ordernum = newOrdernum;
				status.edited = true;
			}
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
		if (this.statuses.length <= 1) {
			this.notificationsService.error('Error', 'Cannot delete the only status left');
			return;
		}
		const config = {
			id: status.id,
			statuses: this.statuses
		};
		this.dialogService.show(MoveIssuesComponent, 350, 200, config).subscribe(moveto => {
			if (moveto !== null) {
				const { id } = status;
				this.statusService.moveStatusIssues({ id, moveto }).subscribe(response => {
					this.resetStatuses();
				});
			}
		});
	}

	onEditStatusesClick() {
		this.editStatuses = !this.editStatuses;
	}

	saveStatuses() {
		let toUpdate = [];
		this.statuses.forEach(status => {
			if (status.edited) {
				delete status.edited;
				toUpdate.push(status);
			}
		});
		if (toUpdate.length > 0) {
			this.statusService.updateStatuses(toUpdate).subscribe(response => {
				if (this.editStatuses) {
					this.editStatuses = false;
				}
				this.resetStatuses();
			});
		}
		else {
			this.editStatuses = false;
		}
	}

}
