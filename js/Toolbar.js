
var Toolbar = function ( editor ) {

	var signals = editor.signals;
	
	var container = new UI.Panel();
	container.setId( 'toolbar' );

	var buttons = new UI.Panel();
	container.add( buttons );


	// three scenes in a row
	var two = new UI.Button( 'Two' );
	var currSelected = two;
	var currRules = Config.sceneSize.two;
	two.dom.classList.add( 'selected' );

	two.onClick( function () {
    	updateSceneSizeUI(2);
	} );
		buttons.add( two );

	// three scenes in a row
	var three = new UI.Button( 'Three' );
	// var currSelected = three;
	// var currRules = Config.sceneSize.three;
	
	three.onClick( function () {
    	updateSceneSizeUI(3);
	} );
	buttons.add( three );

	var four = new UI.Button( 'Four' );
	
	four.onClick( function () {
		updateSceneSizeUI(4);
	} );
	buttons.add( four );



	function updateSceneSizeUI ( type ) {

		
		two.dom.classList.remove( 'selected' );
		three.dom.classList.remove( 'selected' );
		four.dom.classList.remove( 'selected' );

		switch ( type ) {

			case 2: 
				rules = Config.sceneSize.two;
				currSelected = two;
				break;
			case 3: 
				rules = Config.sceneSize.three;
				currSelected = three; 
				break;
			case 4: 
				rules = Config.sceneSize.four;
				currSelected = four; 
				break;

		}

		currSelected.dom.classList.add( 'selected' );
		currRules = rules;
		editor.displayAllScenes();
		editor.setSceneSize(rules);
	
		editor.fullScreenMode = 0;
		// var currButton = three;
		// var preButton = four;
		// var rules = Config.sceneSize.three;
		// if( type == 1 ) {
		// 	currButton = four;
		// 	preButton = three;
		// 	rules = Config.sceneSize.four;
		// }
	
		// if (currButton.dom.classList.contains( 'selected' )) {
			
		// 	return;
	
		// }
		// else {
		// 	editor.setSceneSize(rules);
		// 	editor.displayAllScenes();
		// 	editor.fullScreenMode = 0;
		// 	currButton.dom.classList.add( 'selected' );
		// 	currSelected = currButton;
		// 	currRules = rules;
		// 	preButton.dom.classList.remove( 'selected' );
		// }

	}



	var playButton = new UI.Button( 'play' ).setMarginLeft('20px');

	playButton.onClick( function () {
		if (playButton.dom.classList.contains( 'selected' )) {
			playButton.dom.classList.remove( 'selected' );
			signals.stopAnimations.dispatch( );

		}
		else{
			playButton.dom.classList.add( 'selected' );
			signals.animationRequired.dispatch( );
		}
		// signals.selectionModeChanged.dispatch( 0 );
	} );
	buttons.add( playButton );
	
	
	
	var screenShotButton = new UI.Button( 'Scrn' ).setMarginLeft('20px');
	
	screenShotButton.onClick( function () {

		signals.screenShot.dispatch( );
	} );
	buttons.add( screenShotButton );

	// var singleSelection = new UI.Button( 'Single Selection' );
	// singleSelection.onClick( function () {
    //     signals.selectionModeChanged.dispatch( 1 );
	// } );
	// buttons.add( singleSelection );


	// signals.selectionModeChanged.add( function( type ){

	// 	crossSelection.dom.classList.remove( 'selected' );
	// 	singleSelection.dom.classList.remove( 'selected' );
	

	// 	switch ( type ) {

	// 		case 0: crossSelection.dom.classList.add( 'selected' ); break;
	// 		case 1: singleSelection.dom.classList.add( 'selected' ); break;

	// 	}
	// });

	signals.fullScreenMode.add( function(bool, scene){

		if( bool == true ) {
			editor.hideOtherScenes(scene);
			currSelected.dom.classList.remove( 'selected' );
			signals.renderRequired.dispatch();
		}
		else {
			editor.displayAllScenes();
			editor.setSceneSize( currRules );
			currSelected.dom.classList.add( 'selected' );
		
		}

	});

	return container;

};


