var Sidebar = function ( editor ) {

	var container = new UI.Panel();
	var signals = editor.signals;
	container.setId( 'sidebar' );


	var viewTab = new UI.Text( 'View' ).onClick( onClick );
	var plotTab = new UI.Text( 'Plot' ).onClick( onClick );
	// var clusterTab  = new UI.Text( 'CLUSTER' ).onClick( onClick );
	
	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	tabs.add( viewTab,plotTab );
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


	// var editMode = new UI.Span().add(
	// 	new Sidebar.Edit( editor )

	// );
	// container.add( editMode );


	function onClick( event ) {
		select( event.target.textContent );
	}

	function select( section ) {

		viewTab.setClass( '' );
		plotTab.setClass( '' );
		// editTab.setClass( '' );

		view.setDisplay( 'none' );
		plot.setDisplay( 'none' );
		// editMode.setDisplay( 'none' );

		switch ( section ) {
			case 'View':
				viewTab.setClass( 'selected' );
				view.setDisplay( '' );

				break;
			case 'Plot':
				plotTab.setClass( 'selected' );
				plot.setDisplay( '' );
				break;
		// 	case 'CLUSTER':
		// 		clusterTab.setClass( 'selected' );
		// 		cluster.setDisplay( '' );
		// 		break;
		}

	}

	select( 'View' );
	return container;

};
