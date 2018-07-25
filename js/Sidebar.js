var Sidebar = function ( editor ) {

	var container = new UI.Panel();
	var signals = editor.signals;
	container.setId( 'sidebar' );


	var viewTab = new UI.Text( 'View' ).onClick( onClick );
	var plotTab = new UI.Text( 'Plot' ).onClick( onClick );
	var settingsTab  = new UI.Text( 'Settings' ).onClick( onClick );
	
	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	tabs.add( viewTab,plotTab,settingsTab );
	//	, clusterTab, editTab
	container.add( tabs );

	var view = new UI.Span().add(
		new Sidebar.View( editor )
	);
	container.add( view );


	var plot = new UI.Span().add(
		new Sidebar.Plot( editor )
	);
	container.add( plot );


	var settings = new UI.Span().add(
		new Sidebar.Settings( editor )

	);
	
	container.add( settings );


	function onClick( event ) {
		select( event.target.textContent );
	}

	function select( section ) {

		viewTab.setClass( '' );
		plotTab.setClass( '' );
		settingsTab.setClass( '' );

		view.setDisplay( 'none' );
		plot.setDisplay( 'none' );
		settings.setDisplay( 'none' );

		switch ( section ) {
			case 'View':
				viewTab.setClass( 'selected' );
				view.setDisplay( '' );

				break;
			case 'Plot':
				plotTab.setClass( 'selected' );
				plot.setDisplay( '' );
				break;
			case 'Settings':
				settingsTab.setClass( 'selected' );
				settings.setDisplay( '' );
				break;
		}

	}

	select( 'View' );
	return container;

};
