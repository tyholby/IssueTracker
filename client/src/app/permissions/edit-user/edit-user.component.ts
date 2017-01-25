import { Component, OnInit } from '@angular/core';
import { MTCDialogService } from 'mtc-modules';

@Component({
	selector: 'app-edit-user',
	templateUrl: './edit-user.component.html',
	styleUrls: ['./edit-user.component.less']
})
export class EditUserComponent implements OnInit {
	selectedUser: any;
	showProgress: boolean = false;

	constructor(private dialogService: MTCDialogService) {
	}

	ngOnInit() {
		this.selectedUser = this.dialogService.getData();
	}

	setRole(role) {
		//TODO delete user task
	}

	onDelete() {
		//TODO delete user task
	}

	onCancel() {
		//TODO delete user task
	}


}
