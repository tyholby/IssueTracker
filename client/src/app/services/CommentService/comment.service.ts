import { Injectable } from '@angular/core';
import { MTCHttp } from 'mtc-modules';
import { HostnameService } from '../../core/services/hostname/hostname.service';

@Injectable()
export class CommentService {
	constructor(private hostname: HostnameService,
				private http: MTCHttp) { }

	getCommentsByIssueId(issueId) {
		return this.http.get(`${this.hostname.travelUrl}comment/${issueId}`);
	}
	addComment(comment) {
		return this.http.post(`${this.hostname.travelUrl}comment/`, JSON.stringify(comment));
	}
	deleteComment(id) {
		return this.http.delete(`${this.hostname.travelUrl}comment/${id}`);
	}
	updateComment(comment) {
		return this.http.put(`${this.hostname.travelUrl}comment/`, JSON.stringify(comment));
	}
}

