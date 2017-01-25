import { Injectable } from '@angular/core';
import { MTCHttp } from 'mtc-modules';
import { HostnameService } from '../../core/services/hostname/hostname.service';

@Injectable()
export class UserService {
	public currentUser = {
		role: null
	};
	public currentLdsAccount = {};

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

	searchUsers(name) {
		return this.http.get(`https://api.mtc.byu.edu/user/v1/users?search=${name}`);
	}
	isAdmin() {
		return this.currentUser.role === 'admin';
	}
}
