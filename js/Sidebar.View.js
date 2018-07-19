
Sidebar.View = function ( editor ) {


	var container = new UI.Panel();
	var signals = editor.signals;
	container.add( new UI.Break(),new UI.Break());

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


	signals.objectSelected.add( function ( objects ){

		updateInfoGui( objects );
	});

	function updateInfoGui(objects){

		parameters.clear();
		var objectNameSet = new Set();
		parameters.add( new UI.Break());

		parameters.add(new UI.HorizontalRule());
		parameters.add( new UI.Break());

		for ( let object of objects){
			if(objectNameSet.has(object.name)) continue;
			objectNameSet.add(object.name);
			// Sequence name
			var nameRow = new UI.Row();
			var name = new UI.Text(object.name).setFontSize( '15px' ).setTextAlign('center').setWidth('100%').setFontWeight('bold');
			nameRow.add( name );
			parameters.add( nameRow );
			var freqHeaderRow = new UI.Row();

			var fa = new UI.Text('fA').setWidth( '50px' );
			var ft = new UI.Text('fT').setWidth( '50px' );
			var fg = new UI.Text('fG').setWidth( '50px' );
			var fc = new UI.Text('fC').setWidth( '50px' );

			freqHeaderRow.add( new UI.Text( '' ).setWidth( '100px' ));
			freqHeaderRow.add( fa, ft, fg, fc );
			parameters.add(freqHeaderRow);
			//1st position freq
			parameters.add( addFrequenceRow(editor.inputData[object.name].firstPositionFreq, '1st pos') );

			//2nd position freq
			parameters.add( addFrequenceRow(editor.inputData[object.name].secondPositionFreq, '2nd pos') );

			//3rd position freq
			parameters.add( addFrequenceRow(editor.inputData[object.name].thirdPositionFreq, '3rd pos') );

			//All position freq
			parameters.add( addFrequenceRow(editor.inputData[object.name].allPositionFreq, 'Total') );
			parameters.add( new UI.Break());
			// current axes
			var freqRow = new UI.Row();
			// console.log(editor.inputData.single[name])
			var freq = '';
			console.log(object.freq,object.name);
			for ( let [key,value] of Object.entries(object.freq)){
				freq += 'f'+key+': '+Math.round10(value,-2)+' ';
			}
			
			freqRow.add( new UI.Text( 'Current Axes:' ).setWidth( '90px' ));
			freqRow.add(  new UI.Text(freq) );
			parameters.add( freqRow );

			var seqLenRow = new UI.Row();
			seqLenRow.add( new UI.Text( 'Sequence length:' ).setWidth( '120px' ));
			seqLenRow.add(  new UI.Text(editor.inputData[object.name].totalLen) );
			parameters.add( seqLenRow );

			var gapsRow = new UI.Row();
			gapsRow.add( new UI.Text( 'Gaps:' ).setWidth( '120px' ));
			gapsRow.add(  new UI.Text(editor.inputData[object.name].gapNum) );
			parameters.add( gapsRow );

			var unknownSeqNumRow = new UI.Row();
			unknownSeqNumRow.add( new UI.Text( 'Unknown Nucl N:' ).setWidth( '120px' ));
			unknownSeqNumRow.add(  new UI.Text(editor.inputData[object.name].unknownSeqNum) );
			parameters.add( unknownSeqNumRow );

			var otherSeqNumRow = new UI.Row();
			otherSeqNumRow.add( new UI.Text( 'Other Nucls:' ).setWidth( '120px' ));
			otherSeqNumRow.add(  new UI.Text(editor.inputData[object.name].otherSeqNum) );
			parameters.add( otherSeqNumRow );
		}
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



	return container;

};