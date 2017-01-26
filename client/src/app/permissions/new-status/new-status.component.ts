import { Component, OnInit } from '@angular/core';
import { StatusService } from '../../services/StatusService/status.service';
import { MTCDialogService } from 'mtc-modules';

@Component({
	selector: 'app-new-status',
	templateUrl: './new-status.component.html',
	styleUrls: ['./new-status.component.less']
})
export class NewStatusComponent implements OnInit {
	statusName: string;
	showProgress: boolean;
	nextOrdernum: number;

	constructor(private statusService: StatusService, private dialogService: MTCDialogService) {
		this.statusName = '';
		this.showProgress = false;
	}

	ngOnInit() {
		this.nextOrdernum = this.dialogService.getData();
	}

	onSubmit() {
		this.showProgress = true;
		const status = {
			id: null,
			description: this.statusName,
			ordernum: this.nextOrdernum
		};
		this.statusService.addStatus(status).subscribe(response => {
			this.dialogService.hide(true);
		});
	}

	onCancel() {
		this.dialogService.hide(false);
	}

}
