import { Component, OnInit } from '@angular/core';
import { MTCDialogService } from 'mtc-modules';
import { UserService } from '../../services/UserService/user.service';
import { IssueService } from '../../services/IssueService/issue.service';

@Component({
	selector: 'app-edit-user',
	templateUrl: './edit-user.component.html',
	styleUrls: ['./edit-user.component.less']
})
export class EditUserComponent implements OnInit {
	selectedUser: any;
	showProgress: boolean = false;
	showDeleteConfirmation: boolean = false;
	updatedUser:boolean = false;

	constructor(private dialogService: MTCDialogService, private userService: UserService) {
	}

	ngOnInit() {
		this.selectedUser = this.dialogService.getData();
	}

	setRole(role) {
		this.selectedUser.role = role;
		this.updatedUser = true;
		this.userService.updateUser(this.selectedUser).subscribe(u => {
			if (this.userService.currentUser.ldsid === this.selectedUser.ldsid) {
				this.userService.setCurrentUserSource(this.selectedUser);
			}
			else (this.userService.setCurrentUserSource(this.userService.currentUser))
		});
	}

	onDelete() {
		this.showProgress = true;
		this.userService.deleteUser(this.selectedUser.ldsid).subscribe(response => {
			this.showProgress = false;
			this.dialogService.hide(true);
		});
	}

	onDone() {
		this.dialogService.hide(this.updatedUser);
	}


}
