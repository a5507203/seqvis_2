
Sidebar.View = function ( editor ) {


	var container = new UI.Panel();
	var signals = editor.signals;

	container.add( new UI.Break(),new UI.Break());
	var addElementRow = new UI.Row();
	var addNodeButton = new UI.Button( 'Add VIEW' ).setWidth( '90px' ) ;
	addNodeButton.onClick( function () {

		signals.addScene.dispatch();

	} );
	addElementRow.add(addNodeButton);
	container.add( addElementRow );





	return container;

};