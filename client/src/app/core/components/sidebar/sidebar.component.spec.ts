/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MTCCommonModule } from 'mtc-modules';
import { SidebarComponent } from './sidebar.component';
import { IssueService } from '../../../services/IssueService/issue.service';
import { RouterLinkStubDirective } from '../../../../testing/router.stubs';

class IssueServiceStub {
	public openCreateSideNav() {}
}

describe('SidebarComponent', () => {
	let comp: SidebarComponent;
	let fixture: ComponentFixture<SidebarComponent>;
	let issueService: IssueServiceStub;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				SidebarComponent, RouterLinkStubDirective
			],
			imports: [
				MTCCommonModule,
			],
			providers: [
				{ provide:IssueService, useClass: IssueServiceStub },
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SidebarComponent);

		comp = fixture.componentInstance; // BannerComponent test instance

		issueService = fixture.debugElement.injector.get(IssueService);
	});

	it('should open create issue component on create issue click', async(() => {
		spyOn(issueService, 'openCreateSideNav');
		comp.isAuthorized = true;
		fixture.detectChanges();
		let createIssueButton = fixture.debugElement.query(By.css('.create-new'));
		createIssueButton.triggerEventHandler('click', {});
		expect(issueService.openCreateSideNav).toHaveBeenCalled();
	}));

});








