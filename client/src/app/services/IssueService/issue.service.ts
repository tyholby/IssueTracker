import { Injectable } from '@angular/core';
import { MTCHttp } from 'mtc-modules';
import { HostnameService } from '../../core/services/hostname/hostname.service';
import { Subject } from 'rxjs/Subject';
import { omit } from 'lodash';

@Injectable()
export class IssueService {
	// Observable string sources
	private openCreateSideNavSource: Subject<any> = new Subject<any>();
	private openViewSideNavSource: Subject<any> = new Subject<any>();
	private refreshIssuesSource: Subject<any> = new Subject<any>();
	private filterSource: Subject<string> = new Subject<string>();
	// Observable string streams
	public openCreateSideNav$: any = this.openCreateSideNavSource.asObservable();
	public openViewSideNav$: any = this.openViewSideNavSource.asObservable();
	public refreshIssues$: any = this.refreshIssuesSource.asObservable();
	public filter$: any = this.filterSource.asObservable();

	constructor(private hostname: HostnameService,
				private http: MTCHttp) { }

	getIssues() {
		return this.http.get(`${this.hostname.travelUrl}issue/`);
	}
	getIssueDetails(id) {
		return this.http.get(`${this.hostname.travelUrl}issue/${id}`);
	}
	addIssue(issue) {
		return this.http.post(`${this.hostname.travelUrl}issue/`, JSON.stringify(issue));
	}
	deleteIssue(id) {
		return this.http.delete(`${this.hostname.travelUrl}issue/${id}`);
	}
	updateIssues(issues) {
		return this.http.put(`${this.hostname.travelUrl}issue/`, JSON.stringify(issues.map(i => omit(i, 'assigneeName'))));
	}
	openCreateSideNav() {
		this.openCreateSideNavSource.next();
	}
	openViewSideNav(issue) {
		this.openViewSideNavSource.next(issue);
	}
	refreshIssues() {
		this.refreshIssuesSource.next();
	}
	filter(searchText) {
		this.filterSource.next(searchText);
	}
}
