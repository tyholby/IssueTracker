import { Injectable } from '@angular/core';
import { MTCHttp } from 'mtc-modules';
import { HostnameService } from '../../core/services/hostname/hostname.service';

@Injectable()
export class UserService {

	constructor(private hostname: HostnameService,
				private http: MTCHttp) { }

	getUsers() {
		return this.http.get(`${this.hostname.travelUrl}user/`);
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
}
