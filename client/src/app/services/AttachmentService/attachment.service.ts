import { Injectable } from '@angular/core';
import { MTCHttp } from 'mtc-modules';
import { HostnameService } from '../../core/services/hostname/hostname.service';
import { WindowRefService } from '../../core/services/window-ref/window-ref.service';

@Injectable()
export class AttachmentService {
	constructor(private hostname: HostnameService,
				private http: MTCHttp,
				private windowRef: WindowRefService) { }

	getAttachmentsByIssueId(issueId) {
		return this.http.get(`${this.hostname.travelUrl}attachment/${issueId}`);
	}
	addAttachments(attachments) {
		return this.http.post(`${this.hostname.travelUrl}attachment/`, JSON.stringify(attachments));
	}
	deleteAttachment(id) {
		return this.http.delete(`${this.hostname.travelUrl}attachment/${id}`);
	}
	updateAttachments(attachments) {
		return this.http.put(`${this.hostname.travelUrl}attachment/`, JSON.stringify(attachments));
	}

	onAddAttachmentClick(elId) {
		document.getElementById(elId).click();
	}

	openAttachment(attachment) {
		const win = this.windowRef.getWindow().open(attachment.url, '_blank');
		win.focus();
	}
}
