
		var clientId = '';
		var url = '';
		var env = '';
		if (~window.location.hostname.indexOf('cdn.mtc.byu.edu') ||
				window.location.hostname === 'apps.mtc.byu.edu') {
			clientId = 'c853d894-a7c2-4deb-bd78-37d9a3014e34';
		} else if (~window.location.hostname.indexOf('test-apps.mtc.byu.edu')) {
			clientId = '348d313b-cdbb-4903-9e98-d889f1527cfe';
		} else if (~window.location.hostname.indexOf('stage-apps.mtc.byu.edu')) {
			clientId = '8234ab45-39f4-44e4-b23a-f19be1a197b1';
		} else if (~window.location.hostname.indexOf('beta-apps.mtc.byu.edu')) {
			clientId = '5d39de36-6c16-4a7d-8bd3-8e877d3b5b0c';
		} else {
			clientId = '5ad9e458-a4f9-4252-b6aa-b6be8305762f';
		}

		var contentUrls = [
			'http://localhost:8080',
			'https://devapplications.mtc.byu.edu',
			'https://testapplications.mtc.byu.edu',
			'https://betaapplications.mtc.byu.edu',
			'https://stageapplications.mtc.byu.edu',
			'https://supportapplications.mtc.byu.edu',
			'https://api.mtc.byu.edu',
			'https://app.mtc.byu.edu'
		];

		var scopes = [
			'https://app.mtc.byu.edu/otm',
			'https://api.mtc.byu.edu/messaging',
			'https://app.mtc.byu.edu/missionaryserverside'
		];


		MTCAuth.configure({
			clientId: clientId,
			contentUrls: contentUrls,
			scopes: scopes,
			redirectUri: true,
			options: {
				requestAuths: ''
			},
			newTabRedirectUri: false
		});
