import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'mtc-env',
	template: ''
})
export class MTCEnvStubComponent {
	@Input() includeVersion: boolean;
}

@Component({
	selector: 'mtc-dialog',
	template: ''
})
export class MTCDialogStubComponent {

}

@Component({
	selector: 'mtc-layout',
	template: ''
})
export class MTCLayoutStubComponent {

}

@Component({
	selector: 'simple-notifications',
	template: ''
})
export class SimpleNotificationsStubComponent {
	@Input() options: any;
}

@Component({
	selector: 'app-sidebar',
	template: ''
})
export class SideBarStubComponent {
	@Input() isAuthorized: boolean;
}

@Component({
	selector: 'router-outlet',
	template: ''
})
export class RouterOutletStubComponent {

}

@Component({
	selector: 'app-create-issue',
	template: ''
})
export class CreateIssueStubComponent {
	@Input() createdBy: any;
}

@Component({
	selector: 'app-view-issue',
	template: ''
})
export class ViewIssueStubComponent {
	@Input() data: any;
	@Output() onClose = new EventEmitter();
}
