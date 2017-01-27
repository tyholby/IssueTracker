import { Injectable } from '@angular/core';
import { MTCHttp } from 'mtc-modules';
import { HostnameService } from '../../core/services/hostname/hostname.service';

@Injectable()
export class StatusService {
	constructor(private hostname: HostnameService,
				private http: MTCHttp) { }

	getStatuses() {
		return this.http.get(`${this.hostname.travelUrl}status/`);
	}
	getStatus(id) {
		return this.http.get(`${this.hostname.travelUrl}status/${id}`);
	}
	addStatus(status) {
		return this.http.post(`${this.hostname.travelUrl}status/`, JSON.stringify(status));
	}
	deleteStatus(id) {
		return this.http.delete(`${this.hostname.travelUrl}status/${id}`);
	}
	updateStatuses(statuses) {
		return this.http.put(`${this.hostname.travelUrl}status/`, JSON.stringify(statuses));
	}
}
