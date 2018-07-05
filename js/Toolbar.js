
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
	three.dom.classList.add( 'selected' );
	three.onClick( function () {
    	updateSceneSizeUI(0);
	} );
	buttons.add( three );

	var four = new UI.Button( 'FOUR' );
	four.onClick( function () {
		updateSceneSizeUI(1);
	} );
	buttons.add( four );



	var toggleAxes = new UI.Button( 'Toggle Axes' ).setMarginLeft('20px');
	toggleAxes.dom.classList.add( 'selected' );
	toggleAxes.onClick( function () {
    //    updateGraphElementDisplay( 0 );
	} );
	buttons.add( toggleAxes );

	var toggleWireframe = new UI.Button( 'Toggle Wireframe' );
	toggleWireframe.onClick( function () {
        // updateGraphElementDisplay( 1 );
	} );
	buttons.add( toggleWireframe );

	var toggleLabels = new UI.Button( 'Toggle Base Labels' );
	toggleLabels.onClick( function () {
        // updateGraphElementDisplay( 2 );
	} );
	buttons.add( toggleLabels );


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


