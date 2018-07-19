

Sidebar.Plot = function ( editor ) {

	var container = new UI.Panel();
	var signals = editor.signals;
	// var inputData = null;
	container.add( new UI.Break(),new UI.Break());

	var pointSizeRow = new UI.Row();
	var pointSize = new UI.Integer().setStep(1).setRange(1,5).setValue(5).onChange(function(){
		signals.pointSizeChanged.dispatch(pointSize.getValue()/500);

	});
	pointSizeRow.add( new UI.Text( 'Point size' ).setWidth( '120px' ) );
	pointSizeRow.add( pointSize );
	container.add( pointSizeRow );
	container.add( new UI.HorizontalRule() );
	container.add( new UI.Break(),new UI.Break());

	var viewType = {
		'allPositionFreq':'All position',
		'firstPositionFreq':'1st codon position',
		'secondPositionFreq':'2nd codon position',
		'thirdPositionFreq':'3st codon position'
	};
	var viewOptionRow = new UI.Row();
	var viewOptions = new UI.Select().setOptions( viewType ).setWidth( '120px' ).setValue('allPositionFreq').setFontSize( '12px' );
	viewOptionRow.add( new UI.Text( 'Choose view' ).setWidth( '120px' ) );
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
		'A,TG,C':['A','M','C'],
		'A,CT,G':['A','Y','G'],
		'A,T,CG':['A','T','S'],
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
	plotOptionsRow.add( new UI.Text( 'Choose plots' ).setWidth( '120px' ) );
	plotOptionsRow.add(plotOptions);
	container.add( plotOptionsRow );


	//ADD PlOT
	var addPlotButton = new UI.Button( 'Add plot' );
	addPlotButton.onClick( function () {
		if (editor.inputData == null) return; 
		var dim = plotOptions.getValue();
		var axesName = axesNames[dim];
		dim = dim.split(',');	
		var graphType = viewOptions.getValue();
		console.log(axesName);
		var newCoordinates = getCoordinates(editor.inputData,graphType, dim, axesName);
		signals.addScene.dispatch(viewType[graphType],newCoordinates,dim,axesName);

	} );
	container.add(addPlotButton);

	container.add( new UI.Break(),new UI.Break());



	signals.dataPrepared.add(function( ){
		console.log('dataPrepared');
		var singleCoordinates = getCoordinates(editor.inputData,'allPositionFreq' ,['A','C','G','T']);

		signals.addScene.dispatch(viewType.allPositionFreq, singleCoordinates,['A','C','G','T'],['A','C','G','T']);

		var firstPosCoordinates = getCoordinates(editor.inputData,'firstPositionFreq', ['A','C','G','T']);
		signals.addScene.dispatch(viewType.firstPositionFreq,firstPosCoordinates,['A','C','G','T'],['A','C','G','T']);

		var secondPosCoordinates = getCoordinates(editor.inputData,'secondPositionFreq', ['A','C','G','T']);
		signals.addScene.dispatch(viewType.secondPositionFreq,secondPosCoordinates,['A','C','G','T'],['A','C','G','T']);

		var thirdPosCoordinates = getCoordinates(editor.inputData,'thirdPositionFreq', ['A','C','G','T']);
		signals.addScene.dispatch(viewType.thirdPositionFreq,thirdPosCoordinates,['A','C','G','T'],['A','C','G','T']);
		
	});

	var data = localStorage.getItem('file');
	var type = localStorage.getItem('type');
	if(data) signals.fileLoaded.dispatch(data,type);
	localStorage.clear();
	return container;

};