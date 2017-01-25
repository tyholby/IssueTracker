import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/UserService/user.service';
import { MTCDialogService } from 'mtc-modules';


@Component({
	selector: 'app-new-user',
	templateUrl: './new-user.component.html',
	styleUrls: ['./new-user.component.less']
})
export class NewUserComponent implements OnInit {
	searchText: string;
	searchResults: Array<any>;
	selectedUser: any;
	showProgress: boolean;

	constructor(private userService: UserService, private dialogService: MTCDialogService) {
		this.searchText = '';
		this.searchResults = [];
		this.selectedUser = null;
		this.showProgress = false;
	}

	ngOnInit() {
	}

	onSearch() {
		this.selectedUser = null;
		if (this.searchText.length > 3) {
			this.userService.searchUsers(this.searchText).subscribe(usersResponse => {
				this.searchResults = usersResponse.json().map(user => {
					return {
						ldsid: user.ldsId,
						fullName: `${user.restOfName} ${user.surName}`,
						role: null
					}
				})
			});
		}
	}

	onResultClick(result) {
		this.selectedUser = result;
		this.searchResults = [];
	}

	setRole(role) {
		this.selectedUser.role = role;
	}

	onSubmit() {
		this.showProgress = true;
		this.userService.addUser(this.selectedUser).subscribe(response => {
			this.dialogService.hide(true);
		});
	}

	onCancel() {
		this.dialogService.hide(false);
	}

}
