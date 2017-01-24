/* tslint:disable:no-unused-variable */

import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { MTCCommonModule } from 'mtc-modules';

import { HomeComponent } from './home.component';
import { ListStubComponent, ListItemStubComponent } from '../../testing/material-module-stubs';
import { UserService } from '../services/UserService/user.service';

class UserServiceStub {
	public getUsers() {}
	public addUser() {}
	public deleteUser() {}
	public updateUser() {}
}

describe('HomeComponent', () => {
	let comp: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;
	let userService: UserServiceStub;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ HomeComponent, ListStubComponent, ListItemStubComponent ],
			imports: [ MTCCommonModule ],
			providers: [
				{ provide:UserService, useClass: UserServiceStub },
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HomeComponent);

		comp = fixture.componentInstance; // BannerComponent test instance

		userService = fixture.debugElement.injector.get(UserService);

	});

	it('should create', () => {
		expect(comp).toBeTruthy();
	});
});
