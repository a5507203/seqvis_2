
Sidebar.View = function ( editor ) {


	var container = new UI.Panel();
	var signals = editor.signals;
	// var inputData = null;
	container.add( new UI.Break(),new UI.Break());

	//VIEW
	var viewType = {
		'single':'All position',
		'first':'1st codon position',
		'second':'2nd codon position',
		'third':'3st codon position'
	};
	var viewOptionRow = new UI.Row();
	var viewOptions = new UI.Select().setOptions( viewType ).setWidth( '120px' ).setValue('single').setFontSize( '12px' );
	viewOptionRow.add( new UI.Text( 'Choose View' ).setWidth( '120px' ) );
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
	plotOptionsRow.add( new UI.Text( 'Choose Plots' ).setWidth( '120px' ) );
	plotOptionsRow.add(plotOptions);
	container.add( plotOptionsRow );


	//ADD PlOT
	var addPlotButton = new UI.Button( 'Add Plot' );
	addPlotButton.onClick( function () {
		if (editor.inputData == null) return; 
		var dim = plotOptions.getValue();
		var axesName = axesNames[dim];
		dim = dim.split(',');	
		var graphType = viewOptions.getValue();
		console.log(axesName);
		var newCoordinates = getCoordinates(editor.inputData[graphType], dim, axesName);
		signals.addScene.dispatch(viewType[graphType],newCoordinates,dim,axesName);

	} );
	container.add(addPlotButton);

	container.add( new UI.Break(),new UI.Break());

	container.add(new UI.HorizontalRule());
		container.add( new UI.Break());


	//SEARCH BY NAME
	var searchRow = new UI.Row();
	var seqName = new UI.Input().setWidth( '100px' ).setValue('').setFontSize( '12px' );
	searchRow.add( new UI.Text( 'Sequence name' ).setWidth( '120px' ) );
	searchRow.add( seqName );
	container.add( searchRow );

	var searchButton = new UI.Button( 'Search' ).setWidth('70').setLeft( '20px' );
	searchButton.onClick( function () {
		editor.selectByName(seqName.getValue());
	});

	searchRow.add(searchButton);

	var parameters = new UI.Span();
	container.add( parameters );

	signals.dataPrepared.add(function( ){
		
		var singleCoordinates = getCoordinates(editor.inputData.single, ['A','C','G','T']);

		signals.addScene.dispatch(viewType.single, singleCoordinates,['A','C','G','T'],['A','C','G','T']);

		var firstPosCoordinates = getCoordinates(editor.inputData.first, ['A','C','G','T']);
		signals.addScene.dispatch(viewType.first,firstPosCoordinates,['A','C','G','T'],['A','C','G','T']);

		var secondPosCoordinates = getCoordinates(editor.inputData.second, ['A','C','G','T']);
		signals.addScene.dispatch(viewType.second,secondPosCoordinates,['A','C','G','T'],['A','C','G','T']);

		var thirdPosCoordinates = getCoordinates(editor.inputData.third, ['A','C','G','T']);
		signals.addScene.dispatch(viewType.third,thirdPosCoordinates,['A','C','G','T'],['A','C','G','T']);
		

	});

	signals.objectSelected.add( function ( object ){

		// console.log(editor.inputData.single[name]);
		updateInfoGui( object );
	});

	function updateInfoGui(object){


		

		parameters.clear();

		parameters.add( new UI.Break());

		parameters.add(new UI.HorizontalRule());
		parameters.add( new UI.Break());
		var freqs;
		// original Data
		// var originalDataRow = new UI.Row();
		// var originalData = new UI.P(editor.inputData.rawData[name]);
		// originalDataRow.add( new UI.Text( 'ORIGINAL DATA' ));
		// originalDataRow.add( originalData );
		// parameters.add( originalDataRow );
		// parameters.add( new UI.Break(),new UI.Break());

		// Codon
		// var codonRow = new UI.Row();
		// var codon = new UI.P(editor.inputData.singleSeq[name]);
		// codonRow.add( new UI.Text( 'CODON' ));
		// codonRow.add( codon );
		// parameters.add( codonRow );

		// // freq
		// var condonFreqRow = new UI.Row();
		// // console.log(editor.inputData.single[name])
		// var freqs = editor.inputData.single[name];
		// console.log(freqs);
		// var condonFreq = new UI.Text('A: '+Math.round10(freqs.A,-2)+'  G: '+Math.round10(freqs.G,-2)+'  C: '+Math.round10(freqs.C,-2)+'   T: '+Math.round10(freqs.T,-2));
		// condonFreqRow.add( new UI.Text( 'FREQUENCE:' ).setWidth( '100px' ));
		// condonFreqRow.add( condonFreq );
		// parameters.add( condonFreqRow );
		// parameters.add( new UI.Break(),new UI.Break());


		// Sequence name
		var firstRow = new UI.Row();
		var first = new UI.Text(object.name);
		firstRow.add( new UI.Text( 'Sequence name:' ).setWidth('120px'));
		firstRow.add( first );
		parameters.add( firstRow );
		parameters.add( new UI.Break());


		var freqHeaderRow = new UI.Row();

		var fa = new UI.Text('fA').setWidth( '50px' );
		var ft = new UI.Text('fT').setWidth( '50px' );
		var fg = new UI.Text('fG').setWidth( '50px' );
		var fc = new UI.Text('fC').setWidth( '50px' );

		freqHeaderRow.add( new UI.Text( '' ).setWidth( '100px' ));
		freqHeaderRow.add( fa, ft, fg, fc );
		parameters.add(freqHeaderRow);
		//1st position freq
		parameters.add( addFrequenceRow(editor.inputData.first[object.name], '1st pos') );

		//2nd position freq
		parameters.add( addFrequenceRow(editor.inputData.second[object.name], '2nd pos') );

		//3rd position freq
		parameters.add( addFrequenceRow(editor.inputData.third[object.name], '3rd pos') );

		//All position freq
		parameters.add( addFrequenceRow(editor.inputData.single[object.name], 'Total') );
		parameters.add( new UI.Break());
		// current axes
		var freqRow = new UI.Row();
		// console.log(editor.inputData.single[name])
		var freq = '';
		console.log(object.freq,object.name);
		for ( let [key,value] of Object.entries(object.freq)){
			freq += 'f'+key+': '+Math.round10(value,-2)+' ';
		}
		var freqs = editor.inputData.third[name];
		// var thirdFreq = new UI.Text('A: '+Math.round10(freqs.A,-2)+'  G: '+Math.round10(freqs.G,-2)+'  C: '+Math.round10(freqs.C,-2)+'   T: '+Math.round10(freqs.T,-2));
		freqRow.add( new UI.Text( 'Current axes' ).setWidth( '100px' ));
		freqRow.add(  new UI.Text(freq) );
		
		parameters.add( freqRow );

	}

	function addFrequenceRow(data, name){

		var allPositionFreqRow = new UI.Row();

		var a = new UI.Text(Math.round10(data.A,-2)).setWidth( '50px' );
		var t = new UI.Text(Math.round10(data.T,-2)).setWidth( '50px' );
		var g = new UI.Text(Math.round10(data.G,-2)).setWidth( '50px' );
		var c = new UI.Text(Math.round10(data.C,-2)).setWidth( '50px' );

		allPositionFreqRow.add( new UI.Text( name ).setWidth( '100px' ));
		allPositionFreqRow.add( a, t, g, c );
		return allPositionFreqRow;
	}


	var data = localStorage.getItem('file');
	var type = localStorage.getItem('type');
	if(data) signals.fileLoaded.dispatch(data,type);
	localStorage.clear();
	return container;

};