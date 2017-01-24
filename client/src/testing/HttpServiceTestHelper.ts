/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { HostnameService } from '../app/core/services/hostname/hostname.service';
import { MTCHttp } from 'mtc-modules';
import { BaseRequestOptions, Response, Http, BaseResponseOptions, ConnectionBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

class MockHostnameService {
	public travelUrl:string = 'travel';
	public url:string = 'url';
	public missionarySystemsUrl:string = 'msSystems';
}

export class HttpServiceTestHelper {
	static mockbackend: MockBackend;

	static configureTest(component:any){
		TestBed.configureTestingModule({
			providers: [
				{
					provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
						return new Http(backend, defaultOptions);
					}, deps: [MockBackend, BaseRequestOptions]
				},
				{ provide: component, useClass: component },
				{ provide: MockBackend, useClass: MockBackend },
				{ provide: HostnameService, useClass: MockHostnameService },
				{ provide: BaseRequestOptions, useClass: BaseRequestOptions },
				{ provide: MTCHttp, useClass: MTCHttp}
			]
		});
	}

	static runTest(service,funcName,...funcParams){
		let expectedResponseCount = 2;
		let expectedResponse = 'It worked';
		let callSuccess = false;
		let connection;

		expect(service).toBeTruthy();
		expect(funcName).toBeTruthy();

		this.mockbackend.connections.subscribe(c => connection = c);

		service[funcName](...funcParams).subscribe((response) => {
			callSuccess = true;

			let responseArr = response.json();
			expect(responseArr.length).toBe(expectedResponseCount);
			expect(responseArr[0]).toBe(expectedResponse);
		});

		connection.mockRespond(new Response({body: [expectedResponse,expectedResponse]}));
		expect(callSuccess).toBe(true);
	}


}
