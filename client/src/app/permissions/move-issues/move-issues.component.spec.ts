/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MTCDialogService, MTCCommonModule } from 'mtc-modules';
import { ProgressBarStubComponent } from '../../../testing/material-module-stubs';
import { FormsModule } from '@angular/forms';
import { MoveIssuesComponent } from './move-issues.component';
import { IssueService } from '../../services/IssueService/issue.service';
import { returnObserverWithCallback } from '../../../testing/observerHelpers';

class MTCDialogServiceStub {
	public hide(data) {}
	public getData() {
		return {
			id: '123',
			statuses: [
				{
					id: '123'
				},
				{
					id: 'not 123'
				}
			]
		};
	}
}

let issues = [{
	id: '123'
}];
class IssueServiceStub {
	public getIssuesForStatus(id) {
		return returnObserverWithCallback(issues, true);
	}
}

describe('MoveIssuesComponent', () => {
	let comp: MoveIssuesComponent;
	let fixture: ComponentFixture<MoveIssuesComponent>;
	let issueService: IssueServiceStub;
	let dialogService: MTCDialogServiceStub;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				MoveIssuesComponent, ProgressBarStubComponent
			],
			imports: [
				FormsModule,
				MTCCommonModule,
			],
			providers: [
				{ provide:IssueService, useClass:IssueServiceStub },
				{ provide:MTCDialogService, useClass:MTCDialogServiceStub },
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MoveIssuesComponent);

		comp = fixture.componentInstance; // BannerComponent test instance

		issueService = fixture.debugElement.injector.get(IssueService);
		dialogService = fixture.debugElement.injector.get(MTCDialogService);
	});

	it('should filter statuses on init', async(() => {
		fixture.detectChanges();
		expect(comp.statuses[0].id).toBe('not 123');
	}));

	it('should return empty statuses on init', async(() => {
		const temp = Object.assign({}, issues[0]);
		issues = [];
		fixture.detectChanges();
		expect(comp.statuses.length).toBe(0);
		issues = [temp];
	}));

	it('should submit on click', async(() => {
		spyOn(dialogService, 'hide').and.callThrough();
		fixture.detectChanges();
		let submitButton = fixture.debugElement.query(By.css('._submit-button'));
		submitButton.triggerEventHandler('click', {});
		expect(dialogService.hide).toHaveBeenCalledWith('');
	}));

});








