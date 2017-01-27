import { Injectable } from '@angular/core';
import { MTCHttp } from 'mtc-modules';
import { HostnameService } from '../../core/services/hostname/hostname.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserService {
	public currentUser: any = {
		role: null
	};

	// Observable string sources
	private currentUserChangedSource: Subject<any> = new Subject<any>();
	private currentLdsAccountSource: Subject<any> = new Subject<any>();

	// Observable string streams
	public currentUser$: any = this.currentUserChangedSource.asObservable();
	public currentLdsAccount$: any = this.currentLdsAccountSource.asObservable();

	constructor(private hostname: HostnameService,
				private http: MTCHttp) { }

	getUsers() {
		return this.http.get(`${this.hostname.travelUrl}user/`);
	}
	getUser(ldsid) {
		return this.http.get(`${this.hostname.travelUrl}user/${ldsid}`);
	}
	addUser(user) {
		return this.http.post(`${this.hostname.travelUrl}user/`, JSON.stringify(user));
	}
	deleteUser(ldsid) {
		return this.http.delete(`${this.hostname.travelUrl}user/${ldsid}`);
	}
	updateUser(user) {
		return this.http.put(`${this.hostname.travelUrl}user/`, JSON.stringify(user));
	}

	isAdmin(user) {
		return user.role === 'admin';
	}
	searchUsers(name) {
		return this.http.get(`https://api.mtc.byu.edu/user/v1/users?search=${name}`);
	}
	setCurrentUserSource(currentUser){
		this.currentUser = currentUser;
		this.currentUserChangedSource.next(this.currentUser);
	}
	setCurrentLdsAccountSource(ldsAccount){
		this.currentLdsAccountSource.next(ldsAccount);
	}
}
