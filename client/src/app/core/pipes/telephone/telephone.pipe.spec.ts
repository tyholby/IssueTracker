// /* tslint:disable:no-unused-variable */
//
// import { TestBed, async, inject } from '@angular/core/testing';
// import { TelephonePipe } from './telephone.pipe';
//
// describe('Pipe: Telephone', () => {
// 	beforeEach(() => {
// 		TestBed.configureTestingModule({
// 			providers: [
// 				TelephonePipe
// 			]
// 		});
// 	});
//
// 	it('should transform the input', inject([TelephonePipe], (pipe: TelephonePipe) => {
// 		expect(pipe.transform('123-123-1234')).toEqual('(123) 123-1234');
// 		expect(pipe.transform('1123-123-1234')).toEqual('1 (123) 123-1234');
// 		expect(pipe.transform('11123-123-1234')).toEqual('111 (23) 123-1234');
// 		expect(pipe.transform('111123-123-1234')).toEqual('111123-123-1234');
// 		expect(pipe.transform('')).toEqual('');
// 		expect(pipe.transform('(123)123-1234')).toEqual('(123)123-1234');
// 	}));
// });
