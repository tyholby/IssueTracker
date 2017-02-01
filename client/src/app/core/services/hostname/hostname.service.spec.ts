/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HostnameService } from './hostname.service';
import { WindowRefService } from '../window-ref/';

let _location = {
	hostname:'localhost:4200'
};

class WindowRefServiceStub {
	getWindow(){
		return {
			get location(){
				return _location;
			}
		};
	}
}

describe('Service: Hostname', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{ provide: HostnameService, useClass: HostnameService },
				{ provide: WindowRefService, useClass: WindowRefServiceStub }
			]
		});
	});

	it('should initilize correctly to local dev', inject([HostnameService], (service: HostnameService) => {
		expect(service).toBeTruthy();
		expect(service.url).toBe('http://localhost:8080/');
		expect(service.travelUrl).toBe('http://localhost:8080/otm/');
		expect(service.missionarySystemsUrl).toBe('http://localhost:8080/missionarysystemsdev/v1/');
		expect(service.env).toBe('dev');
	}));

	it('should initilize correctly to devapps', inject([HostnameService], (service: HostnameService) => {
		_location.hostname = 'dev-apps.mtc.byu.edu/operations';
		service.init();
		expect(service.url).toBe('https://devapplications.mtc.byu.edu/');
		expect(service.travelUrl).toBe('https://devapplications.mtc.byu.edu/otm/');
		expect(service.missionarySystemsUrl).toBe('https://devapplications.mtc.byu.edu/missionarysystemsdev/v1/');
		expect(service.env).toBe('dev');
	}));

	it('should initilize correctly to beta', inject([HostnameService], (service: HostnameService) => {
		_location.hostname = 'beta-apps.mtc.byu.edu/operations';
		service.init();
		expect(service.url).toBe('https://betaapplications.mtc.byu.edu/');
		expect(service.travelUrl).toBe('https://betaapplications.mtc.byu.edu/otm/');
		expect(service.missionarySystemsUrl).toBe('https://betaapplications.mtc.byu.edu/missionarysystemsbeta/v1/');
		expect(service.env).toBe('beta');
	}));

	it('should initilize correctly to stage', inject([HostnameService], (service: HostnameService) => {
		_location.hostname = 'stage-apps.mtc.byu.edu/operations';
		service.init();
		expect(service.url).toBe('https://stageapplications.mtc.byu.edu/');
		expect(service.travelUrl).toBe('https://stageapplications.mtc.byu.edu/otm/');
		expect(service.missionarySystemsUrl).toBe('https://stageapplications.mtc.byu.edu/missionarysystemsstage/v1/');
		expect(service.env).toBe('stage');
	}));

	it('should initilize correctly to test', inject([HostnameService], (service: HostnameService) => {
		_location.hostname = 'test-apps.mtc.byu.edu/operations';
		service.init();
		expect(service.url).toBe('https://testapplications.mtc.byu.edu/');
		expect(service.travelUrl).toBe('https://testapplications.mtc.byu.edu/otm/');
		expect(service.missionarySystemsUrl).toBe('https://testapplications.mtc.byu.edu/missionarysystemstest/v1/');
		expect(service.env).toBe('test');
	}));

	it('should initilize correctly to support', inject([HostnameService], (service: HostnameService) => {
		_location.hostname = 'support-apps.mtc.byu.edu/operations';
		service.init();
		expect(service.url).toBe('https://supportapplications.mtc.byu.edu/');
		expect(service.travelUrl).toBe('https://supportapplications.mtc.byu.edu/otm/');
		expect(service.missionarySystemsUrl).toBe('https://supportapplications.mtc.byu.edu/missionarysystemssupport/v1/');
		expect(service.env).toBe('support');
	}));

	it('should initilize correctly to prod', inject([HostnameService], (service: HostnameService) => {
		_location.hostname = 'apps.mtc.byu.edu/operations';
		service.init();
		expect(service.url).toBe('https://app.mtc.byu.edu/');
		expect(service.travelUrl).toBe('https://app.mtc.byu.edu/otm/');
		expect(service.missionarySystemsUrl).toBe('https://app.mtc.byu.edu/missionarysystems/v1/');
		expect(service.env).toBe('prod');
	}));
});
