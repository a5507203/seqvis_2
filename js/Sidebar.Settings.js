
Sidebar.Settings = function ( editor ) {


	var container = new UI.Panel();
	var signals = editor.signals;

	container.add( new UI.Break(),new UI.Break());
	// class

	var options = {
		'0': 'colored',
		'1': 'black and white'
	};

	var themeRow = new UI.Row();
	var theme = new UI.Select().setWidth( '150px' );
	theme.setOptions( options ).setValue('0');

	theme.onChange( function () {

		signals.changeColorScheme.dispatch(theme.getValue());

	} );

	themeRow.add( new UI.Text( 'Theme' ).setWidth( '90px' ) );
	themeRow.add( theme );

	container.add( themeRow );

	return container;

};