import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.less']
})
export class CalendarComponent implements OnInit {
	viewDate = new Date();
	view = 'month';

	constructor() {
	}

	ngOnInit() {
	}

}
