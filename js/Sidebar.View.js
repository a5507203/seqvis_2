
Sidebar.View = function ( editor ) {


	var container = new UI.Panel();
	var signals = editor.signals;
	// var inputData = null;
	container.add( new UI.Break(),new UI.Break());

	//VIEW
	var viewType = {
		'single':'Codon',
		'first':'First Position',
		'second':'Second Position',
		'third':'Third Position'
	};
	var viewOptionRow = new UI.Row();
	var viewOptions = new UI.Select().setOptions( viewType ).setWidth( '120px' ).setValue('single').setFontSize( '12px' );
	viewOptionRow.add( new UI.Text( 'CHOOSE VIEW' ).setWidth( '120px' ) );
	viewOptionRow.add(viewOptions);
	container.add( viewOptionRow );

	//PLOT TYPE
	var plotTypes = {
		'A,C,G,T':'ACGT',

		'AT,G,C':'WGC (pool A and T)',
		'AG,C,T':'RTC (pool A and G)',
		'AC,G,T':'KTG (pool A and C)',
		'A,TG,C':'MAC (pool T and G)',
		'A,CT,G':'YAG (pool T and C)',
		'A,T,CG':'SAT (pool C and G)',

		'AT,GC':'WS (AT vs GC)',
		'AG,CT':'RY (AG vs CT)',
		'AC,GT':'KM (AC vs GT)',
		'ATG,C':'DC (ATG vs C)',
		'AGC,T':'VT (AGC vs T)',
		'ACT,G':'HG (ACT vs G)',
		'GCT,A':'BA (GCT vs A)'
	};

	var axesNames = {

		'A,C,G,T':['A','C','G','T'],
		'AT,G,C':['W','G','C'],
		'AG,C,T':['R','T','C'],
		'AC,G,T':['K','T','G'],
		'A,TG,C':['M','A','C'],
		'A,CT,G':['Y','A','G'],
		'A,T,CG':['S','A','T'],
		'AT,GC':['W','S'],
		'AG,CT':['R','Y'],
		'AC,GT':['K','M'],
		'ATG,C':['D','C'],
		'AGC,T':['V','T'],
		'ACT,G':['H','G'],
		'GCT,A':['B','A']

	};

	var plotOptionsRow = new UI.Row();
	var plotOptions = new UI.Select().setOptions( plotTypes ).setWidth( '120px' ).setValue('A,C,G,T').setFontSize( '12px' );
	plotOptionsRow.add( new UI.Text( 'CHOOSE PLOTS' ).setWidth( '120px' ) );
	plotOptionsRow.add(plotOptions);
	container.add( plotOptionsRow );


	//ADD PlOT
	var addViewButton = new UI.Button( 'Add PLOT' );
	addViewButton.onClick( function () {
		if (editor.inputData == null) return; 
		var dim = plotOptions.getValue();
		var axesName = axesNames[dim];
		dim = dim.split(',');	
		var newCoordinates = getCoordinates(editor.inputData[viewOptions.getValue()], dim);
		signals.addScene.dispatch(newCoordinates,dim,axesName);

	} );
	container.add(addViewButton);

	signals.dataPrepared.add(function( ){
		
		var singleCoordinates = getCoordinates(editor.inputData.single, ['A','C','G','T']);
		console.log(editor.inputData);
		signals.addScene.dispatch(singleCoordinates,['A','C','G','T'],['A','C','G','T']);

		var firstPosCoordinates = getCoordinates(editor.inputData.first, ['A','C','G','T']);
		signals.addScene.dispatch(firstPosCoordinates,['A','C','G','T'],['A','C','G','T']);

		var secondPosCoordinates = getCoordinates(editor.inputData.second, ['A','C','G','T']);
		signals.addScene.dispatch(secondPosCoordinates,['A','C','G','T'],['A','C','G','T']);

		var thirdPosCoordinates = getCoordinates(editor.inputData.third, ['A','C','G','T']);
		signals.addScene.dispatch(thirdPosCoordinates,['A','C','G','T'],['A','C','G','T']);
		

	});

	return container;

};