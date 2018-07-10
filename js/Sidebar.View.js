
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
	var addPlotButton = new UI.Button( 'Add PLOT' );
	addPlotButton.onClick( function () {
		if (editor.inputData == null) return; 
		var dim = plotOptions.getValue();
		var axesName = axesNames[dim];
		dim = dim.split(',');	
		var newCoordinates = getCoordinates(editor.inputData[viewOptions.getValue()], dim);
		signals.addScene.dispatch(newCoordinates,dim,axesName);

	} );
	container.add(addPlotButton);

	container.add( new UI.Break(),new UI.Break());

	container.add(new UI.HorizontalRule());
		container.add( new UI.Break());


	//SEARCH BY NAME
	var searchRow = new UI.Row();
	var seqName = new UI.Input().setWidth( '100px' ).setValue('').setFontSize( '12px' );
	searchRow.add( new UI.Text( 'NAME' ).setWidth( '50px' ) );
	searchRow.add( seqName );
	container.add( searchRow );

	var searchButton = new UI.Button( 'SEARCH' ).setWidth('70').setLeft( '20px' );
	searchButton.onClick( function () {
		editor.selectByName(seqName.getValue());
	});

	searchRow.add(searchButton);

	var parameters = new UI.Span();
	container.add( parameters );

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

	signals.objectSelected.add( function ( name ){

		// console.log(editor.inputData.single[name]);
		updateInfoGui( name );
	});

	function updateInfoGui(name){

		parameters.clear();

		// original Data
		var originalDataRow = new UI.Row();
		var originalData = new UI.P(editor.inputData.rawData[name]);
		originalDataRow.add( new UI.Text( 'ORIGINAL DATA' ));
		originalDataRow.add( originalData );
		parameters.add( originalDataRow );
		parameters.add( new UI.Break(),new UI.Break());

		// Codon
		var codonRow = new UI.Row();
		var codon = new UI.P(editor.inputData.singleSeq[name]);
		codonRow.add( new UI.Text( 'CODON' ));
		codonRow.add( codon );
		parameters.add( codonRow );

		// freq
		var condonFreqRow = new UI.Row();
		// console.log(editor.inputData.single[name])
		var freqs = editor.inputData.single[name];
		console.log(freqs);
		var condonFreq = new UI.Text('A: '+Math.round10(freqs.A,-2)+'  G: '+Math.round10(freqs.G,-2)+'  C: '+Math.round10(freqs.C,-2)+'   T: '+Math.round10(freqs.T,-2));
		condonFreqRow.add( new UI.Text( 'FREQUENCE:' ).setWidth( '100px' ));
		condonFreqRow.add( condonFreq );
		parameters.add( condonFreqRow );
		parameters.add( new UI.Break(),new UI.Break());


		// first
		var firstRow = new UI.Row();
		var first = new UI.P(editor.inputData.firstSeq[name]);
		firstRow.add( new UI.Text( 'FIRST POS' ));
		firstRow.add( first );
		parameters.add( firstRow );

		// freq
		var firstFreqRow = new UI.Row();
		freqs = editor.inputData.first[name];
		var firstFreq = new UI.Text('A: '+Math.round10(freqs.A,-2)+'  G: '+Math.round10(freqs.G,-2)+'  C: '+Math.round10(freqs.C,-2)+'   T: '+Math.round10(freqs.T,-2));
		firstFreqRow.add( new UI.Text( 'FREQUENCE:' ).setWidth( '100px' ));
		firstFreqRow.add( firstFreq );
		parameters.add( firstFreqRow );
		parameters.add( new UI.Break(),new UI.Break());

		// SECOND
		var secondSeqRow = new UI.Row();
		var secondSeq = new UI.P(editor.inputData.secondSeq[name]);
		secondSeqRow.add( new UI.Text( 'SECOND POS' ));
		secondSeqRow.add( secondSeq );
		parameters.add( secondSeqRow );

		// freq
		var secondFreqRow = new UI.Row();
		// console.log(editor.inputData.single[name])
		freqs = editor.inputData.second[name];
		var  secondFreq = new UI.Text('A: '+Math.round10(freqs.A,-2)+'  G: '+Math.round10(freqs.G,-2)+'  C: '+Math.round10(freqs.C,-2)+'   T: '+Math.round10(freqs.T,-2));
		secondFreqRow.add( new UI.Text( 'FREQUENCE:' ).setWidth( '100px' ));
		secondFreqRow.add( secondFreq );
		parameters.add( secondFreqRow );
		parameters.add( new UI.Break(),new UI.Break());

		// third
		var thirdSeqRow = new UI.Row();
		var thirdSeq = new UI.P(editor.inputData.thirdSeq[name]);
		thirdSeqRow.add( new UI.Text( 'THIRD POS' ));
		thirdSeqRow.add( thirdSeq );
		parameters.add( thirdSeqRow );

		// freq
		var thirdFreqRow = new UI.Row();
		// console.log(editor.inputData.single[name])
		freqs = editor.inputData.third[name];
		var  thirdFreq = new UI.Text('A: '+Math.round10(freqs.A,-2)+'  G: '+Math.round10(freqs.G,-2)+'  C: '+Math.round10(freqs.C,-2)+'   T: '+Math.round10(freqs.T,-2));
		thirdFreqRow.add( new UI.Text( 'FREQUENCE:' ).setWidth( '100px' ));
		thirdFreqRow.add( thirdFreq );
		parameters.add( thirdFreqRow );

	};


	return container;

};