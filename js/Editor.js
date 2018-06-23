var Editor = function (  ) {


	this.fullScreenMode = 0;
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('id', 'c');
	document.body.appendChild(this.canvas);

	styleEl = document.createElement('style');
	document.head.appendChild(styleEl);
	this.styleSheet = styleEl.sheet;
	this.styleSheet.insertRule(Config.sceneSize.three,0);

	this.viewport = document.createElement('div');
	this.viewport.setAttribute('id','content');

	document.body.appendChild(this.viewport);

	this.addNewEdgeMode = 0;

	var Signal = signals.Signal;

	this.signals = {


		editorCleared: new Signal(),

		savingStarted: new Signal(),
		savingFinished: new Signal(),
		loadDataUrl: new Signal(),
	

		refreshAvaiableGames: new Signal(),
		windowResize: new Signal(),

		cameraChanged: new Signal(),
		objectSelected: new Signal(),
		objectAdded: new Signal(),
		objectChanged: new Signal(),

		refreshSidebarObjectProperties: new Signal(),

		addScene: new Signal(),
		setSceneSize: new Signal(),
		deleteScene: new Signal(),	
		fullScreenMode: new Signal(),
		renderRequired: new Signal(),
	};


	this.scenes = [];

	this.fullScreenScene = null;





};

Editor.prototype = {

	deleteScene:function(listItem,sceneName){
	
		var index = 0;
		console.log(this.scenes.length);
		for( var scene of this.scenes){
			if(scene.name != sceneName) index += 1;
			else break;
		}
		this.scenes.splice(index, 1);
		this.signals.renderRequired.dispatch();
		this.viewport.removeChild(listItem);
		// this.scenes;
	},

	hideOtherScenes:function(scene){
		

		for ( var currScene of this.scenes ) {

			if (currScene.uuid != scene.uuid ) {
				// console.log(scene)
				currScene.userData.element.parentElement.style.display = 'none';
			}
			this.setSceneSize(Config.sceneSize.fullScreen);
			this.signals.renderRequired.dispatch();
			
		}

	},

	displayAllScenes:function() {
		for ( var currScene of this.scenes ) {
			currScene.userData.element.parentElement.style.display = '';
		}
		this.signals.renderRequired.dispatch();
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
		

		var zoominButton = document.createElement('button');
		zoominButton.setAttribute('class','zoomButton');
		zoominButton.innerText ='full screen';
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
		closeButton.setAttribute('class','closeButton');
		closeButton.innerText =String.fromCodePoint(0x2716);
		closeButton.onclick = function(){
			//TODO signal based or not
			scope.deleteScene(listItem,sceneName);
		};

		footRow.appendChild(closeButton);

		listItem.appendChild(sceneContainer);
		listItem.appendChild(footRow);

		return listItem;

	},


	addScene: function(){
		var scope = this;
		var geometries = [
			new THREE.ConeBufferGeometry( 2, 3, 3 ),

		];

		var i = scope.scenes.length;
		var scene = new THREE.Scene();
		// make a list item
		var element = editor.createSceneContainer(i,scene);


		scene.userData.element = element.querySelector( ".scene" );
		scope.viewport.appendChild( element );
		scene.name = i;
		var camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
		camera.position.z = 7;
		scene.userData.camera = camera;
		var controls = new THREE.OrbitControls( scene.userData.camera, scene.userData.element );
		controls.minDistance = 0.5;
		controls.maxDistance = 7;
		controls.enablePan = false;
		// controls.enableZoom = false;
		scene.userData.controls = controls;
		controls.addEventListener('change', function(){
			scope.signals.renderRequired.dispatch();
		});

		
		// add one random mesh to each scene
		var geometry = geometries[ geometries.length * Math.random() | 0 ];
		var material = new THREE.MeshStandardMaterial( {
			color: new THREE.Color().setHSL( Math.random(), 1, 0.75 ),
			roughness: 0.5,
			metalness: 0,
			flatShading: true,
			side:2,
			wireframe:true
		} );
		scene.add( new THREE.Mesh( geometry, material ) );
		scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );
		var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
		light.position.set( 1, 1, 1 );
		scene.add( light );
		scope.scenes.push( scene );
		scope.signals.renderRequired.dispatch();
	},

	setSceneSize: function(rules){
		this.styleSheet.deleteRule(0);
		this.styleSheet.insertRule(rules, 0);
		this.signals.renderRequired.dispatch();
	}

};

