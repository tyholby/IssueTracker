import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/UserService/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

	constructor() {
	}

	ngOnInit() {

	}

	/* TODO storage API
	HTML:
	<mtc-file [preview]="true" [name]="'Upload Image'" (onFileSelected)="onImageFileSelected($event)"></mtc-file>

	TS:
	import { StorageApiService } from 'mtc-modules';

	onImageFileSelected(file) {
		this.storageService.submitFile(file).subscribe((uploadDetails) => {
			console.log('submitted', uploadDetails);
			----- uploadDetails looks like this:
			{
				extension: ".jpg",
				mimeType: "image/jpeg",
				sha1: "kBWpRHvSHhQfS33jpQaZXNB0JhI=",
				url: "https://cdn.mtc.byu.edu/storage/5ad9e458-a4f9-4252-b6aa-b6be8305762f/dev/e53b3810-2856-4e26-b7ab-4867420491c2.jpg"
			}
			------
		});
	}
	*/
}
