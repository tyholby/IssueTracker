import { Injectable, OnInit } from '@angular/core';
import { WindowRefService } from '../window-ref';

@Injectable()
export class HostnameService {
	_url:string = 'http://localhost:8080/';
	env:string = 'dev';

	constructor(private windowRefService: WindowRefService) {
		let url = '';
		let env = '';
		let win = this.windowRefService.getWindow();
		if (~win.location.hostname.indexOf('cdn.mtc.byu.edu') ||
				win.location.hostname === 'apps.mtc.byu.edu') {
			url = 'https://app.mtc.byu.edu/';
			env = '';
		} else if (~win.location.hostname.indexOf('support-apps.mtc.byu.edu')) {
			url = 'https://supportapplications.mtc.byu.edu/';
			env = 'support';
		} else if (~win.location.hostname.indexOf('test-apps.mtc.byu.edu')) {
			url = 'https://testapplications.mtc.byu.edu/';
			env = 'test';
		} else if (~win.location.hostname.indexOf('stage-apps.mtc.byu.edu')) {
			url = 'https://stageapplications.mtc.byu.edu/';
			env = 'stage';
		} else if (~win.location.hostname.indexOf('beta-apps.mtc.byu.edu')) {
			url = 'https://betaapplications.mtc.byu.edu/';
			env = 'beta';
		} else if (~win.location.hostname.indexOf('dev-apps.mtc.byu.edu')) {
			url = 'https://devapplications.mtc.byu.edu/';
			env = 'dev';
		} else {
			url = 'http://localhost:8080/';
			env = 'dev';
		}

		this.setUrl(url);
		this.setEnv(env);
	}

	setUrl(value) {
		this._url = value;
	}

	setEnv(value) {
		this.env = value;
	}

	get url(){
		return this._url;
	}

	get travelUrl(){
		return `${this._url}otm/`;
	}

	get missionarySystemsUrl(){
		return `${this._url}missionarysystems${this.env}/v1/`;
	}

}
