
var Toolbar = function ( editor ) {

	var signals = editor.signals;
	
	var container = new UI.Panel();
	container.setId( 'toolbar' );

	var buttons = new UI.Panel();
	container.add( buttons );

	// three scenes in a row
	var three = new UI.Button( 'THREE' );
	var currSelected = three;
	var currRules = Config.sceneSize.three;
	
	three.onClick( function () {
    	updateSceneSizeUI(0);
	} );
	buttons.add( three );

	var four = new UI.Button( 'FOUR' );
	four.dom.classList.add( 'selected' );
	four.onClick( function () {
		updateSceneSizeUI(1);
	} );
	buttons.add( four );



	function updateSceneSizeUI ( type ) {

		var currButton = three;
		var preButton = four;
		var rules = Config.sceneSize.three;
		if( type == 1 ) {
			currButton = four;
			preButton = three;
			rules = Config.sceneSize.four;
		}
	
		if (currButton.dom.classList.contains( 'selected' )) {
			
			return;
	
		}
		else {
			editor.setSceneSize(rules);
			editor.displayAllScenes();
			editor.fullScreenMode = 0;
			currButton.dom.classList.add( 'selected' );
			currSelected = currButton;
			currRules = rules;
			preButton.dom.classList.remove( 'selected' );
		}

	}



	var crossSelection = new UI.Button( 'Cross Selection' ).setMarginLeft('20px');
	crossSelection.dom.classList.add( 'selected' );
	crossSelection.onClick( function () {
		signals.selectionModeChanged.dispatch( 0 );
	} );
	buttons.add( crossSelection );

	var singleSelection = new UI.Button( 'Single Selection' );
	singleSelection.onClick( function () {
        signals.selectionModeChanged.dispatch( 1 );
	} );
	buttons.add( singleSelection );


	signals.selectionModeChanged.add( function( type ){

		crossSelection.dom.classList.remove( 'selected' );
		singleSelection.dom.classList.remove( 'selected' );
	

		switch ( type ) {

			case 0: crossSelection.dom.classList.add( 'selected' ); break;
			case 1: singleSelection.dom.classList.add( 'selected' ); break;

		}
	});

	signals.fullScreenMode.add( function(bool, scene){

		if( bool == true ) {
			editor.hideOtherScenes(scene);
			currSelected.dom.classList.remove( 'selected' );
		}
		else {
			editor.setSceneSize( currRules );
			currSelected.dom.classList.add( 'selected' );
			editor.displayAllScenes();
		}

	});

	return container;

};


