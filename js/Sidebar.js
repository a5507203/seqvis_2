var Sidebar = function ( editor ) {

	var container = new UI.Panel();
	var signals = editor.signals;
	container.setId( 'sidebar' );


	var viewTab = new UI.Text( 'VIEW' ).onClick( onClick );
	var editTab = new UI.Text( 'EDIT' ).onClick( onClick );
	var clusterTab  = new UI.Text( 'CLUSTER' ).onClick( onClick );
	
	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	tabs.add( viewTab, clusterTab, editTab );
	container.add( tabs );

	var view = new UI.Span().add(
		new Sidebar.View( editor )
	);
	container.add( view );


	var cluster = new UI.Span().add(
		new Sidebar.ClusterMethod( editor )
	);
	container.add( cluster );


	var editMode = new UI.Span().add(
		new Sidebar.Edit( editor )

	);
	container.add( editMode );


	function onClick( event ) {
		select( event.target.textContent );
	}

	function select( section ) {

		viewTab.setClass( '' );
		clusterTab.setClass( '' );
		editTab.setClass( '' );

		view.setDisplay( 'none' );
		cluster.setDisplay( 'none' );
		editMode.setDisplay( 'none' );

		switch ( section ) {
			case 'VIEW':
				viewTab.setClass( 'selected' );
				view.setDisplay( '' );

				break;
			case 'EDIT':
				editTab.setClass( 'selected' );
				editMode.setDisplay( '' );
				break;
			case 'CLUSTER':
				clusterTab.setClass( 'selected' );
				cluster.setDisplay( '' );
				break;
		}

	}

	select( 'VIEW' );
	return container;

};
