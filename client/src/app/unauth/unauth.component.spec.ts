/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UnauthComponent } from './unauth.component';

describe('UnauthComponent', () => {
	let comp: UnauthComponent;
	let fixture: ComponentFixture<UnauthComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				UnauthComponent
			],
			imports: [
			],
			providers: [
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UnauthComponent);

		comp = fixture.componentInstance; // BannerComponent test instance
	});

	it('should create the unauth component', async(() => {
		expect(comp).toBeTruthy();
	}));
});








