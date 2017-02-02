/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MTCDialogService, MTCCommonModule } from 'mtc-modules';
import { ProgressBarStubComponent } from '../../../testing/material-module-stubs';
import { FormsModule } from '@angular/forms';
import { NewStatusComponent } from './new-status.component';
import { StatusService } from '../../services/StatusService/status.service';
import { returnObserverWithCallback } from '../../../testing/observerHelpers';

class StatusServiceStub {
	public addStatus(status) {
		return returnObserverWithCallback({}, false);
	}
}

class MTCDialogServiceStub {
	public hide(data) {}
	public getData() {
		return 1;
	}
}

describe('NewStatusComponent', () => {
	let comp: NewStatusComponent;
	let fixture: ComponentFixture<NewStatusComponent>;
	let statusService: StatusServiceStub;
	let dialogService: MTCDialogServiceStub;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				NewStatusComponent, ProgressBarStubComponent
			],
			imports: [
				FormsModule,
				MTCCommonModule,
			],
			providers: [
				{ provide:StatusService, useClass:StatusServiceStub },
				{ provide:MTCDialogService, useClass:MTCDialogServiceStub },
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NewStatusComponent);

		comp = fixture.componentInstance; // BannerComponent test instance

		statusService = fixture.debugElement.injector.get(StatusService);
		dialogService = fixture.debugElement.injector.get(MTCDialogService);
	});

	it('should set nextOrdernum on init', async(() => {
		fixture.detectChanges();
		expect(comp.nextOrdernum).toBe(1);
	}));

	it('should submit and cancel on click', async(() => {
		spyOn(dialogService, 'hide').and.callThrough();
		fixture.detectChanges();
		let submitButton = fixture.debugElement.query(By.css('._submit-button'));
		let cancelButton = fixture.debugElement.query(By.css('.cancel-button'));
		submitButton.triggerEventHandler('click', {});
		expect(comp.showProgress).toBe(true);
		expect(dialogService.hide).toHaveBeenCalledWith(true);
		cancelButton.triggerEventHandler('click', {});
		expect(dialogService.hide).toHaveBeenCalledWith(false);
	}));

});








