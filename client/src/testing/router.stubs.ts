/* tslint:disable:use-host-property-decorator */
/* tslint:disable:directive-selector */

import { Directive, Input } from '@angular/core';

@Directive({
	selector: '[routerLink]',
	host: {
		'(click)': 'onClick()'
	}
})
export class RouterLinkStubDirective {
	@Input() routerLink: any;
}

export class RouterStub {
	navigateTo = 'none';
	public navigate(link: string) {
		this.navigateTo = link;
	}
}

@Directive({
	selector: '[routerLinkActive]'
})
export class RouterLinkActiveStubDirective {
	@Input() routerLinkActive: any;
}
