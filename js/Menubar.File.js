
Menubar.File = function ( editor ) {
	var signals = editor.signals;
	var NUMBER_PRECISION = 6;

	function parseNumber( key, value ) {

		return typeof value === 'number' ? parseFloat( value.toFixed( NUMBER_PRECISION ) ) : value;

	}


	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Menu' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );


	// UPLOAD FILE
	var form = document.createElement( 'form' );
	form.style.display = 'none';
	document.body.appendChild( form );
	var fileInput = document.createElement( 'input' );
	fileInput.type = 'file';
	fileInput.addEventListener( 'change', function ( event ) {
		signals.fileLoaded.dispatch(fileInput.files[ 0 ]);
		form.reset();

	} );

	var upload = new UI.Row();
	upload.setClass( 'option' );
	upload.setTextContent( 'Upload' );
	upload.onClick( function () {

		fileInput.click();


	} );
	options.add( upload );
	
	return container;



};

function save( blob, filename ) {

	link.href = URL.createObjectURL( blob );
	link.download = filename || 'data.json';
	link.click();

	// URL.revokeObjectURL( url ); breaks Firefox...

}