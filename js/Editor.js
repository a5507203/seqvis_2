
var ROOTTHREE = 1.7321;
var ROOTSIX = 2.4495;

var Editor = function (  ) {


	this.fullScreenMode = 0;
	this.lockMode = 0;
	this.colorScheme = 0;
	this.animationMode = 0;
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('id', 'c');
	document.body.appendChild(this.canvas);

	styleEl = document.createElement('style');
	document.head.appendChild(styleEl);
	this.styleSheet = styleEl.sheet;
	this.styleSheet.insertRule(Config.sceneSize.two,0);

	this.viewport = document.createElement('div');
	this.viewport.setAttribute('id','content');
	

	document.body.appendChild(this.viewport);

	this.addNewEdgeMode = 0;
	this.inputData  = {};
	this.selectionMode = 0;
	this.animationDict= {};

	var Signal = signals.Signal;

	this.signals = {


		screenShot : new Signal(),
		editorCleared: new Signal(),
		changeColorScheme : new Signal(),

		savingStarted: new Signal(),
		savingFinished: new Signal(),
		loadDataUrl: new Signal(),

		refreshAvaiableGames: new Signal(),
		windowResize: new Signal(),
		sceneResize: new Signal(),

		cameraChanged: new Signal(),
		objectSelected: new Signal(),
		objectAdded: new Signal(),
		objectChanged: new Signal(),
		pointSizeChanged: new Signal(),
		refreshSidebarObjectProperties: new Signal(),

		addScene: new Signal(),
		setSceneSize: new Signal(),
		deleteScene: new Signal(),	
		fullScreenMode: new Signal(),
		animationRequired: new Signal(),
		stopAnimations: new Signal(),
		renderRequired: new Signal(),
		fileLoaded: new Signal(),
		dataPrepared: new Signal(),

		hideChild: new Signal(),
		selectionModeChanged: new Signal()
	};


	this.scenes = [];
	this.selected = [];
	this.fullScreenScene = null;

};

Editor.prototype = {

	select: function ( object ) {

		if (( this.selected[0] != undefined && this.selectionMode == 0 && this.selected[0].name == object.name )||( this.selected[0] != undefined && this.selectionMode == 1 && this.selected[0].uuid == object.uuid ) )return;

		for( let sprite of this.selected ) sprite.material.color.set(Config.colors.DATARED);
		this.selected = [];

		if(this.selectionMode == 0) this.crossSelect( object );
		else this.singleSelect( object );

		this.signals.objectSelected.dispatch( [object] );
		this.signals.renderRequired.dispatch();
	},

	selectByName : function( name ) {
		
		var object = {name: name};

		if ( this.selected[0] != undefined && this.selected[0].name === object.name ) return;

		for( let sprite of this.selected ) sprite.material.color.set(Config.colors.DATARED);
		this.selected = [];
		this.crossSelect( object );
		if(this.selected.length != 0) this.signals.objectSelected.dispatch( this.selected  );
		this.signals.renderRequired.dispatch();


	},
	changePointSize: function( size ) {
		for( let scene of this.scenes) {
			for ( var i = 0 ; i <scene.children[1].children[0].children[2].children.length; i+=1){
				sprite = scene.children[1].children[0].children[2].children[i];
				scene.children[1].children[0].children[2].children[i].scale.set(size,size,size);
				sprite.updateMatrixWorld( true );
			}
		}
		this.signals.renderRequired.dispatch();

	},

	crossSelect: function ( object ) {
		var scope  = this;
		for ( let scene of this.scenes ) {
			for ( var i = 0 ; i <scene.children[1].children[0].children[2].children.length; i+=1){
				
				sprite = scene.children[1].children[0].children[2].children[i];
				
				if (sprite.name.toUpperCase().includes(object.name.toUpperCase())){
					scope.selected.push(sprite);
					sprite.material.color.set(0x00ff00);
				}
			}

		}
		
	},


	singleSelect: function( object ) {

		this.selected.push(object);
		object.material.color.set(0x00ff00);
	},


	deleteScene:function(listItem,uuid){
	
		var index = 0;
	
		for( var scene of this.scenes){
			if(scene.uuid != uuid) index += 1;
			else break;
		}
		TWEEN.remove(this.scenes[index].userData.animation);
		this.scenes.splice(index, 1);
		this.viewport.removeChild(listItem);
		this.signals.renderRequired.dispatch();
	
		// this.scenes;
	},

	hideOtherScenes:function(scene){
		

		for ( var currScene of this.scenes ) {

			if (currScene.uuid != scene.uuid ) {
				// console.log(scene)
				currScene.userData.element.parentElement.style.display = 'none';
			}
			this.setSceneSize(Config.sceneSize.fullScreen);
			// this.signals.renderRequired.dispatch();
			
		}

	},

	displayAllScenes:function() {
		for ( var currScene of this.scenes ) {
			currScene.userData.element.parentElement.style.display = '';
		}
		// this.signals.renderRequired.dispatch();
	},

	createSceneContainer:function(sceneName,scene){

		scope = this;
		var listItem = document.createElement('div');
		listItem.setAttribute('class','list-item');

		var sceneContainer = document.createElement('div');
		sceneContainer.setAttribute('class','scene');

		var footRow = document.createElement('div');
		footRow.setAttribute('class','foot');
		var description = document.createElement('div');
		description.setAttribute('class','description');
		description.innerText = sceneName;
		footRow.appendChild(description);
		

		var toggleAxesButton = document.createElement('button');
		toggleAxesButton.setAttribute('class','optionButton');
		toggleAxesButton.style['background-image'] = 'url(./image/axes.png)';
		footRow.appendChild(toggleAxesButton).onclick = function() {
			scope.signals.hideChild.dispatch(scene, 'axes');
		};;

		var toggleWireframeButton = document.createElement('button');
		toggleWireframeButton.setAttribute('class','optionButton');
		toggleWireframeButton.style['background-image'] = 'url(./image/triangle.png)';
		footRow.appendChild(toggleWireframeButton);
		toggleWireframeButton.onclick = function() {
			scope.signals.hideChild.dispatch(scene, 'wireframe');
		};


		var toggleLabelButton = document.createElement('button');
		toggleLabelButton.setAttribute('class','optionButton');
		toggleLabelButton.style['background-image'] = 'url(./image/acgt.png)';
		toggleLabelButton.onclick = function() {
			scope.signals.hideChild.dispatch(scene, 'labels');
		};
		footRow.appendChild(toggleLabelButton);

		var zoominButton = document.createElement('button');
		zoominButton.setAttribute('class','optionButton');
		// zoominButton.innerText ='full screen';
		zoominButton.style['background-image'] = 'url(./image/resize.png)';
		
		zoominButton.onclick = function(){
			if ( scope.fullScreenMode == 0 ) {
				scope.fullScreenMode = 1;
				scope.signals.fullScreenMode.dispatch(true, scene);
			}
			else {
				scope.fullScreenMode = 0;
				scope.signals.fullScreenMode.dispatch(false, null);
			}
				
		};
		footRow.appendChild(zoominButton);

		var closeButton = document.createElement('button');
		closeButton.setAttribute('class','optionButton');
		// closeButton.innerText =String.fromCodePoint(0x2716);
		closeButton.style['background-image'] = 'url(./image/cross.png)';
		closeButton.onclick = function(){
			//TODO signal based or not
			scope.deleteScene(listItem,scene.uuid);
		};

		footRow.appendChild(closeButton);

		listItem.appendChild(sceneContainer);
		listItem.appendChild(footRow);

		return listItem;

	},

	drawGraph : function( objects, data, dim, axesNames ) {
		
		var graphContainer = new THREE.Group();
		var graphGroup = new THREE.Group();
		if(dim.length == 2) graphGroup.position.set(-0.5, 0, 0);
		if(dim.length == 3) graphGroup.position.set(-0.5, -ROOTTHREE/6, 0);
		if(dim.length == 4) graphGroup.position.set(-0.5, -ROOTTHREE/9, -ROOTTHREE/6);

		graphGroup.add(this.drawWireframe( dim.length-1 ));
		graphGroup.add(this.drawAxes( dim, axesNames ));
		graphGroup.add(this.drawData( objects, data ));
		graphContainer.add(graphGroup);
		return graphContainer;	
		
	}, 

	drawWireframe : function ( dim ) {
		var group = new THREE.Group();
		group.position.set(0,0,0);
		group.name = 'wireframe';
		var geometry = new THREE.BufferGeometry();
		var material = new THREE.LineBasicMaterial({ linewidth:5, color: 0xffffff, vertexColors: THREE.VertexColors });
		var vertices;

		var coloredColors;
		var blackColors;

		// DRAW GRAPH SHAPES
		if(dim == 1) {
		
			vertices = new Float32Array( [
				//l-r
				0, 0, 0,
				1, 0, 0
			] );
			
			coloredColors =  [
				1, 0, 0,
				0, 0, 1
			];
			
			blackColors = [
				0, 0, 0,
				0, 0, 0
			];
			
			
		}
		
		else if(dim == 2) {

			vertices = new Float32Array( [
				//t-l
				0.5, ROOTTHREE/2, 0,
				0, 0, 0,
				//t-r
				0.5, ROOTTHREE/2, 0,
				1, 0, 0,
				//l-r
				0, 0, 0,
				1, 0, 0
			] );
			
			coloredColors = [
				0, 1, 0, 
				1, 0, 0,
				
				0, 1, 0, 
				0, 0, 1,				
				
				1, 0, 0,
				0, 0, 1
			] ;
	
			blackColors = [
				0, 0, 0,
				0, 0, 0,
				
				0, 0, 0,
				0, 0, 0,
				
				0, 0, 0,
				0, 0, 0
			];

		}
		
		else if(dim == 3) {
		
			vertices = new Float32Array( [
				//t-l
				0.5, ROOTSIX/3, ROOTTHREE/6,
				0, 0, 0,
				//t-r
				0.5, ROOTSIX/3, ROOTTHREE/6,
				1, 0, 0,
				//t-f
				0.5, ROOTSIX/3, ROOTTHREE/6,
				0.5, 0, ROOTTHREE/2,
				//l-r
				0, 0, 0,
				1, 0, 0,
				//l-f
				0, 0, 0,
				0.5, 0, ROOTTHREE/2,
				//r-f
				1, 0, 0,
				0.5, 0, ROOTTHREE/2
			

			] );
			
			coloredColors = [
				0, 1, 0, 
				1, 0, 0,
				
				0, 1, 0, 
				0, 0, 1,
				
				0, 1, 0, 		
				1, 1, 0,
				
				1, 0, 0,
				0, 0, 1,
				
				1, 0, 0,
				1, 1, 0,
				
				0, 0, 1,
				1, 1, 0
			];
			
			blackColors = [
				0, 0, 0,
				0, 0, 0,

				0, 0, 0,
				0, 0, 0,
				
				0, 0, 0,
				0, 0, 0,
				
				0, 0, 0,
				0, 0, 0,
				
				0, 0, 0,
				0, 0, 0,
				
				0, 0, 0,
				0, 0, 0
			];			
		}
		
		geometry.colored = coloredColors;
		geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
		
		if(this.colorScheme == 0) geometry.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array(coloredColors), 3 ) );
		else geometry.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array(blackColors), 3 ) );
		
		group.add( new THREE.LineSegments( geometry, material ));
		return group;
	},

	calcuateT: function(start,center){
		var vec = new THREE.Vector3().subVectors(center,start).normalize().multiplyScalar(0.1);
		var res = center.add(vec);
		console.log(res);
		return res;


	},

	calcuateLabel: function(start,center){
		var vec = new THREE.Vector3().subVectors(start,center).normalize().multiplyScalar(0.1);
		var res = start.add(vec);
		console.log(res);
		return res;

	},

	drawAxes: function ( dim, axesNames ) {
	
		var scope = this;
		var group = new THREE.Group();
		group.position.set(0,0,0);
		group.name = 'axesAndLabel';

		var axesGroup = new THREE.Group();
		axesGroup.position.set(0,0,0);
		axesGroup.visible = false;
		
		var labelsGroup = new THREE.Group();
		labelsGroup.position.set(0,0,0);

		group.add(axesGroup);
		// group.add(labelsGroup);
		
		scope.drawAxesLabels(axesNames,function(axeslabelgroup){

			group.add(axeslabelgroup);
			scope.signals.renderRequired.dispatch();
			

		});

		if (dim.length <= 2)  return group;
		var geometry = new THREE.BufferGeometry();
		var material = new THREE.LineBasicMaterial({ linewidth:5, color: 0xffffff, vertexColors: THREE.VertexColors });
		var vertices;
		var coloredColors;
		var blackColors;

		if(dim.length == 3  ){
			vertices = new Float32Array( [
				
				0.5866, 0.3387, 0,
				0, 0, 0,

				0.4134, 0.3387, 0,
				1.0, 0, 0,
			
				0.5, 0.1887, 0,
				0.5, ROOTTHREE/2, 0,

			] );

			coloredColors = [
				1, 0, 0, 
				1, 0, 0, 

				0, 0, 1,
				0, 0, 1,

				0, 1, 0,					
				0, 1, 0
			];
	

			blackColors = [
				0, 0, 0, 
				0, 0, 0, 

				0, 0, 0,
				0, 0, 0,

				0, 0, 0,					
				0, 0, 0
			];
		}

		else if( dim.length == 4 ){

			vertices = new Float32Array( [
				
				0.5783, 0.3148, 0.3339,
				0, 0, 0,

				0.4217, 0.3148, 0.3339,
				1, 0, 0,
			
				0.5, 0.1722, 0.2887,
				0.5, ROOTSIX/3, ROOTTHREE/6,

				0.5, 0.3148, 0.1982,
				0.5, 0, ROOTTHREE/2

			] );

			coloredColors = [
				1, 0, 0, 
				1, 0, 0, 

				0, 0, 1,
				0, 0, 1,

				0, 1, 0,					
				0, 1, 0,

				1, 1, 0,					
				1, 1, 0
			];

			blackColors = [
				0, 0, 0, 
				0, 0, 0, 

				0, 0, 0,
				0, 0, 0,

				0, 0, 0,
				0, 0, 0,

				0, 0, 0,					
				0, 0, 0
			];
		}
			
		// geometry.alternativeColor = 
		// this.calcuateLabel(new THREE.Vector3(0, 0, 0),new THREE.Vector3(0.5, ROOTSIX/9, ROOTTHREE/6));
		// this.calcuateLabel(new THREE.Vector3(1, 0, 0),new THREE.Vector3(0.5, ROOTSIX/9, ROOTTHREE/6));
		// this.calcuateLabel(new THREE.Vector3(0.5, ROOTSIX/3, ROOTTHREE/6),new THREE.Vector3(0.5, ROOTSIX/9, ROOTTHREE/6));
		// this.calcuateLabel(new THREE.Vector3(0.5, 0, ROOTTHREE/2),new THREE.Vector3(0.5, ROOTSIX/9, ROOTTHREE/6));
		geometry.colored = coloredColors;
		geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
		
		if(this.colorScheme == 0) geometry.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array(coloredColors), 3 ) );
		else geometry.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array(blackColors), 3 ) );
	
		axesGroup.add( new THREE.LineSegments( geometry, material ));
		return group;


	},

	createAnimations: function(){
		TWEEN.removeAll();
		for ( var scene of this.scenes){
			this.createAnimation(scene.children[1]);

		}

	},
	createAnimation: function(container){
		var tween = new TWEEN.Tween(container.rotation.clone())
		.to(new THREE.Euler(0,container.rotation.y+6.28, 0), 7000)
		.onUpdate(function() {
			
			container.rotation.copy(new THREE.Euler(this.x,this.y,this.z) );
			container.updateMatrixWorld( true );
		}).repeat(Infinity);
		if(this.animationMode == 1) tween.start();
	},

	startAnimations: function(){
		for(let scene of this.scenes){
			// console.log(scene)
			scene.userData.animation.start();
		}

	},

	drawAxesLabels: function(axesNames,callback){
		
		var scope = this;
		var group = new THREE.Group();
		group.position.set(0,0,0);
		var coloredColors;
		var len = axesNames.length;
		var coordinates;
		if( len == 2 ) {
			coordinates = [
				new THREE.Vector3(0,0,0),
				new THREE.Vector3(1,0,0)
			];
			coloredColors = [0xff0000, 0x0000ff];
		
		}
		else if(len == 3) {
			coordinates = [
				new THREE.Vector3( 0.5, 0.9661, 0 ),
				new THREE.Vector3( -0.0866, -0.05, 0 ),
				new THREE.Vector3( 1.0866, -0.05, 0 )
			];
			coloredColors  = [0x00ff00, 0xff0000, 0x0000ff];
		}
		else if (len == 4) {
			coordinates = [	
				new THREE.Vector3 ( 0.5, 0.9165, 0.2887),
				new THREE.Vector3 ( -0.0783,  -0.0426,  -0.0452),
				new THREE.Vector3 ( 1.0783, -0.0426, -0.0452),
				new THREE.Vector3 ( 0.5, -0.0426, 0.9565)
			];
			coloredColors  = [0x00ff00, 0xff0000, 0x0000ff, 0xffff00];
		}
		var counter = 0;

		var loader = new THREE.TextureLoader();

		function drawAxis(axesName, coordinate, color){
			loader.load(
			
				'./image/'+axesName+'.png',

				function ( texture ) {
				
					// if(len!=3) return;
					if( scope.colorScheme == '0' ) var sprite = scope.drawSprite(coordinate, 0.2, texture, new THREE.Color(color), 'label');
					
					else var sprite = scope.drawSprite(coordinate, 0.2, texture, Config.colors.BLACK, 'label');
					
					sprite.material.colored = new THREE.Color(color);
					group.add( sprite);
					counter += 1;
					if(counter == len) callback(group);
			});
		}

		for ( var i = 0;i<len;i+=1){

			drawAxis(axesNames[i],coordinates[i],coloredColors[i]);

		}
		return group;
	},
	
	changeBufferGeometryColorScheme : function ( parent, type ){
	
		
		for(let child of parent.children){
			var colorAttribute = child.geometry.attributes.color;
			var colored = child.geometry.colored;
			var colorArray = colorAttribute.array;
			if( type == '0' ){
				
				
				for( var index = 0; index < colorArray.length; index += 1 ) {
					
					colorArray[index] = colored[index]
				}
			}
			else{
				
				for( var index = 0; index < colorArray.length; index += 1 ) {
					
					colorArray[index] = 0
				}
			}
			colorAttribute.needsUpdate = true;
			
			
		}

	},
	
	changeSpriteColorScheme: function ( parent, type ){
		console.log(parent);

	
		for(let child of parent.children){
			
			if(type == '1') child.material.color = Config.colors.BLACK;
			else child.material.color = child.material.colored;
			child.material.needsUpdate = true;
		}
		

	},
	drawData: function( objects, data ){

		var group = new THREE.Group();
		group.name  = 'data';
		group.position.set(0, 0, 0);

		for (let [name,pointInfo] of Object.entries(data)){
		
			var sprite = this.drawSprite(pointInfo.position, 0.02, Config.dataTexture, Config.colors.DATARED, name,pointInfo.frequence);
			group.add( sprite );
			objects.push(sprite);
		}
		return group;		
	},

	drawSprite: function(position,scale,texture,color,name, freq){

		var spriteMaterial = new THREE.SpriteMaterial( {map:texture, color: color, alphaTest: 0.5, depthTest: true} );
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.scale.set(scale, scale, scale);
		sprite.position.copy(position);
		if(freq) sprite.freq = freq;
		sprite.name = name;
		return sprite;

	},

	addScene: function(sceneName, data, dim, axesNames ){
		var scope = this;
		var geometries = [
			new THREE.ConeBufferGeometry( 2, 3, 3 ),

		];

		var i = scope.scenes.length;
		var scene = new THREE.Scene();
		// scene.name = i;
		// CREATE PERSPECTIVE CAMERA


		// CREATE ELEMENT IN HTML
		// var element = this.createSceneContainer(dim.join(),scene);
		var element = this.createSceneContainer(sceneName,scene);
	
		scene.userData.element = element.querySelector( ".scene" );
		scope.viewport.appendChild( element );
		var dom = scene.userData.element;
		
		var camera = new THREE.PerspectiveCamera( 50, 1);
		camera.position.x = 0;
		camera.position.z = 1.75;
		
		scene.userData.camera = camera;
		

		// ADD LIGHT
		var light = new THREE.AmbientLight( 0x404040 ); // soft white light
		scene.add( light );
		if(scope.colorScheme == 0)	scene.background = Config.colors.SCENEDARK;
		else scene.background = Config.colors.SCENELIGHT;
		scope.scenes.push( scene );

		

		camera.aspect = dom.offsetWidth / dom.offsetHeight;
		camera.updateProjectionMatrix();

		// ADD ORBIT CONTROLS
		var orbitControls = new THREE.OrbitControls( scene.userData.camera, scene.userData.element );
		orbitControls.minDistance = 0.1;
		orbitControls.maxDistance = 2;
		orbitControls.enablePan = false;
		orbitControls.autoRotate = false;
		// orbitControls.enableZoom = false;
		scene.userData.orbitControls = orbitControls;

		//ADD OBJECT SELECTION CONTROLS
		scope.objectPicking(scene);
		//ADD AXIS AND DATA
		var container = scope.drawGraph(scene.userData.objects, data, dim, axesNames );
		scene.add( container );
		scene.userData.animation = scope.createAnimation(container);
		scope.signals.renderRequired.dispatch();
		orbitControls.addEventListener('change', function(){
			
			if (scope.lockMode == 1 ){
				scope.scenes.forEach(function (otherScene) {
					if(scene != otherScene) {
						var otherCamera  = otherScene.userData.camera;
						var camera = scene.userData.camera;
						otherCamera.position.copy(camera.position);
						otherCamera.scale.copy(camera.scale);
						otherCamera.rotation.copy(camera.rotation);
						// otherCamera.rotation = scene.userData.camera.rotation.clone();

						
					}
					// body...
				})
				
			}
			scope.signals.renderRequired.dispatch();
		});
	},

	objectPicking:function(scene){
		var scope = this;
		var raycaster = scene.userData.raycaster = new THREE.Raycaster();
		var mouse = scene.userData.mouse = new THREE.Vector2();
		var objects = scene.userData.objects = [];
		var camera = scene.userData.camera;
		var container = scene.userData.element;
		
		// events

		function getIntersects( point, objects ) {

			mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );

			raycaster.setFromCamera( mouse, camera );

			return raycaster.intersectObjects( objects );

		}

		var onDownPosition = new THREE.Vector2();
		var onUpPosition = new THREE.Vector2();
		var onDoubleClickPosition = new THREE.Vector2();

		function getMousePosition( dom, x, y ) {

			var rect = dom.getBoundingClientRect();
			return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];

		}


		function handleClick() {
			
			if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) {
			
				var intersects = getIntersects( onUpPosition, objects );
				//var intersects = []

				if ( intersects.length > 0 ) {

					var object = intersects[ 0 ].object;
					
					
					if ( object.userData.object !== undefined ) {


						
					} else {
						console.log('selected',object);
						// console.log(scope.inputData.single[])
						scope.select( object );

					}

				} else {

					// editor.select( null );

				}

				// render();

			}

		}

		function onMouseDown( event ) {

			event.preventDefault();
		
			var array = getMousePosition( container, event.clientX, event.clientY );
			onDownPosition.fromArray( array );


			document.addEventListener( 'mouseup', onMouseUp, false );

		}

		function onMouseUp( event ) {

			var array = getMousePosition( container, event.clientX, event.clientY );
			onUpPosition.fromArray( array );

			handleClick();

			document.removeEventListener( 'mouseup', onMouseUp, false );

		}

		function onTouchStart( event ) {

			var touch = event.changedTouches[ 0 ];

			var array = getMousePosition( container, touch.clientX, touch.clientY );
			onDownPosition.fromArray( array );

			document.addEventListener( 'touchend', onTouchEnd, false );

		}

		function onTouchEnd( event ) {

			var touch = event.changedTouches[ 0 ];

			var array = getMousePosition( container, touch.clientX, touch.clientY );
			onUpPosition.fromArray( array );

			handleClick();

			document.removeEventListener( 'touchend', onTouchEnd, false );

		}


		container.addEventListener( 'mousedown', onMouseDown, false );
		container.addEventListener( 'touchstart', onTouchStart, false );


		
	},

	setSceneSize: function(rules){
		this.styleSheet.deleteRule(0);
		this.styleSheet.insertRule(rules, 0);
		this.signals.sceneResize.dispatch();
	}

};

