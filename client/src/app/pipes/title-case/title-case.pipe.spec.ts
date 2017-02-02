/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { TitleCasePipe } from './title-case.pipe';

describe('TitleCasePipe', () => {
	it('create converts to title case', () => {
		let pipe = new TitleCasePipe();
		expect(pipe).toBeTruthy();
		expect(pipe.transform('test')).toBe('Test');
		expect(pipe.transform('TEST')).toBe('Test');
	});
});
