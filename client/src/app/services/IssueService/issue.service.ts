import { Injectable } from '@angular/core';
import { MTCHttp } from 'mtc-modules';
import { HostnameService } from '../../core/services/hostname/hostname.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class IssueService {
	// Observable string sources
	private openCreateSideNavSource: Subject<any> = new Subject<any>();
	private newIssueAddedSource: Subject<any> = new Subject<any>();
	// Observable string streams
	public openCreateSideNav$: any = this.openCreateSideNavSource.asObservable();
	public newIssueAdded$: any = this.newIssueAddedSource.asObservable();

	constructor(private hostname: HostnameService,
				private http: MTCHttp) { }

	getIssues() {
		return this.http.get(`${this.hostname.travelUrl}issue/`);
	}
	getIssue(id) {
		return this.http.get(`${this.hostname.travelUrl}issue/${id}`);
	}
	addIssue(issue) {
		return this.http.post(`${this.hostname.travelUrl}issue/`, JSON.stringify(issue));
	}
	deleteIssue(id) {
		return this.http.delete(`${this.hostname.travelUrl}issue/${id}`);
	}
	updateIssues(issues) {
		return this.http.put(`${this.hostname.travelUrl}issue/`, JSON.stringify(issues));
	}
	openCreateSideNav() {
		this.openCreateSideNavSource.next();
	}
	newIssueAdded(issue) {
		this.newIssueAddedSource.next(issue);
	}
}
