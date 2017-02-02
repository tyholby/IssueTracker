/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MTCCommonModule } from 'mtc-modules';
import { ProgressBarStubComponent } from '../../testing/material-module-stubs';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { RouterStub } from '../../testing/router.stubs';
import { Router } from '@angular/router';
import { IssueService } from '../services/IssueService/issue.service';
import { StatusService } from '../services/StatusService/status.service';
import { UserService } from '../services/UserService/user.service';
import { DndModule } from 'ng2-dnd';
import { returnObserverWithCallback } from '../../testing/observerHelpers';
import { TitleCasePipe } from '../pipes/title-case/title-case.pipe';

let currentUser = { ldsid: '123', role: 'test', fullName: 'tyler' };
let user2 = { ldsid: '234', role: 'user', fullName: 'other' };
let users = [ currentUser, user2 ];
let userLoaded = true;
class UserServiceStub {
	public currentUser = currentUser;
	public get currentUser$() {
		return returnObserverWithCallback(currentUser, false);
	}
	public getUsers() {
		return returnObserverWithCallback(users, true);
	}
	public userLoaded() {
		return userLoaded;
	}
	public isAdmin() {
		return currentUser.role === 'admin';
	}
	public isUser() {
		return currentUser.role === 'user';
	}
}

let statuses = [
	{
		id: 'issueStatusId',
		description: 'test',
		ordernum: 1,
	}
];
class StatusServiceStub {
	public getStatuses() {
		return returnObserverWithCallback(statuses, true);
	}
}

let filterText = 'tyler';
let issues = [
	{
		id: 'issueid',
		statusid: 'issueStatusId',
		title: 'title',
		description: 'desc',
		duedate: new Date(),
		assigneeid: '123',
		createdbyid: '123'
	},
	{
		id: 'issueid2',
		statusid: 'issueStatusId',
		title: 'title',
		description: 'desc',
		duedate: new Date(),
		assigneeid: '123',
		createdbyid: '123'
	},
	{
		id: 'issueid3',
		statusid: 'issueStatusId',
		title: 'title',
		description: 'desc',
		duedate: new Date(),
		assigneeid: '234',
		createdbyid: '234'
	}
];
class IssueServiceStub {
	public get filter$() {
		return returnObserverWithCallback(filterText, false);
	}
	public get refreshIssues$() {
		return returnObserverWithCallback({}, false);
	}
	public getIssues() {
		return returnObserverWithCallback(issues, true);
	}
	public updateIssues() {
		return returnObserverWithCallback({}, false);
	}
}

describe('HomeComponent', () => {
	let comp: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;
	let userService: UserServiceStub;
	let statusService: StatusServiceStub;
	let issueService: IssueServiceStub;
	let router: RouterStub;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				HomeComponent, ProgressBarStubComponent, TitleCasePipe
			],
			imports: [
				FormsModule,
				MTCCommonModule,
				DndModule.forRoot(),
			],
			providers: [
				{ provide:UserService, useClass:UserServiceStub },
				{ provide:StatusService, useClass:StatusServiceStub },
				{ provide:IssueService, useClass:IssueServiceStub },
				{ provide:Router, useClass:RouterStub },
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HomeComponent);

		comp = fixture.componentInstance; // BannerComponent test instance

		userService = fixture.debugElement.injector.get(UserService);
		statusService = fixture.debugElement.injector.get(StatusService);
		issueService = fixture.debugElement.injector.get(IssueService);
		router = fixture.debugElement.injector.get(Router);
	});

	it('should navigate to unauth on init', async(() => {
		spyOn(router, 'navigate').and.callThrough();
		fixture.detectChanges();
		expect(router.navigate).toHaveBeenCalledWith(['/unauth']);
	}));

	it('should not get users', async(() => {
		spyOn(userService, 'getUsers').and.callThrough();
		spyOn(statusService, 'getStatuses').and.callThrough();
		currentUser.role = null;
		comp.reset();
		expect(userService.getUsers).not.toHaveBeenCalled();
		expect(statusService.getStatuses).not.toHaveBeenCalled();
		currentUser.role = 'admin';
	}));

	it('should reset and filter users, and get issues on init', async(() => {
		currentUser.role = 'user';
		spyOn(userService, 'getUsers').and.callThrough();
		spyOn(statusService, 'getStatuses').and.callThrough();
		fixture.detectChanges();
		expect(comp.statuses.length).toBe(1);
		expect(comp.users.length).toBe(1);
		expect(userService.getUsers).toHaveBeenCalled();
		expect(statusService.getStatuses).toHaveBeenCalled();
		currentUser.role = 'admin';
	}));

	it('should reset and NOT filter users, and get issues on init', async(() => {
		currentUser.role = 'admin';
		spyOn(userService, 'getUsers').and.callThrough();
		spyOn(statusService, 'getStatuses').and.callThrough();
		fixture.detectChanges();
		expect(comp.statuses.length).toBe(1);
		expect(comp.users.length).toBe(2);
		expect(userService.getUsers).toHaveBeenCalled();
		expect(statusService.getStatuses).toHaveBeenCalled();
		currentUser.role = 'admin';
	}));

	it('should filter correctly', async(() => {
		let issue = {
			title: 'title',
			assigneeName: 'Tyler',
		};
		expect(comp.filter(issue)).toBe(true);
		fixture.detectChanges();
		expect(comp.filter(issue)).toBe(true);
		comp.searchText = 'blahblah';
		expect(comp.filter(issue)).toBe(false);
		issue.title = 'blahblahaskdjalskdj';
		expect(comp.filter(issue)).toBe(true);
	}));

	it('should allow drop correctly', async(() => {
		expect(comp.allowDropFunction('userid', 'statusid')({ assigneeid: 'userid', statusid: 'statusid' })).toBe(false);
		expect(comp.allowDropFunction('userid', 'statusid')({ assigneeid: 'test', statusid: 'test' })).toBe(true);
	}));

	it('should set dragging on dragstart', async(() => {
		currentUser.role = 'admin';
		fixture.detectChanges();
		comp.users[0].expanded = true;
		fixture.detectChanges();
		let issueCell = fixture.debugElement.query(By.css('.issue-cell'));
		issueCell.triggerEventHandler('onDragStart', 'test');
		expect(comp.dragging).toBe('test');
		currentUser.role = 'admin';
	}));

	it('should clear dragging on dragend', async(() => {
		currentUser.role = 'admin';
		fixture.detectChanges();
		comp.users[0].expanded = true;
		fixture.detectChanges();
		let issueCell = fixture.debugElement.query(By.css('.issue-cell'));
		issueCell.triggerEventHandler('onDragEnd', 'test');
		expect(comp.dragging).toBe(null);
		currentUser.role = 'admin';
	}));

	it('should update issues on drop success', async(() => {
		currentUser.role = 'admin';
		fixture.detectChanges();
		comp.users[0].expanded = true;
		fixture.detectChanges();
		expect(comp.users[0].issues.issueStatusId.length).toBe(2);
		let issueColumn = fixture.debugElement.query(By.css('.issue-column'));
		issueColumn.triggerEventHandler('onDropSuccess', {
			dragData: issues[2]
		});
		expect(comp.users[0].issues.issueStatusId.length).toBe(3);
		currentUser.role = 'admin';
	}));

});








