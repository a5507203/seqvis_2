var Viewport = function ( editor ) {

	var signals = editor.signals;
	var canvas = editor.canvas;
	var animationLoopId;
	var fullScreenScene = editor.fullScreenScene;
 	var container  = this.container = editor.viewport;
	container.onscroll = function (e) {
		editor.signals.renderRequired.dispatch();
	};
	var scenes = editor.scenes;

	var renderer =  new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
	renderer.setClearColor( 0xffffff, 1 );
	renderer.setPixelRatio( window.devicePixelRatio );

	var sceneHelpers = editor.sceneHelpers;

	//SIGNALS
	signals.addScene.add(function (sceneName, data,dim, axesName) {
		editor.addScene(sceneName, data,dim, axesName);
	});
	
	signals.pointSizeChanged.add(function(size){
		editor.changePointSize(size);
	});

	signals.sceneResize.add(function(){
		sceneResize();
		renderAll();
	});

	signals.windowResize.add( function () {

		sceneResize();
		var width = canvas.clientWidth;
		var height = canvas.clientHeight;
		if ( canvas.width !== width || canvas.height !== height ) {
			renderer.setSize( width, height, false );
		}
		renderAll();

	} );

	signals.renderRequired.add( function () {

		renderAll();

	} );

	signals.animationRequired.add( function () {
		editor.animationMode = 1;
		editor.createAnimations();
		animate();

	} );
	signals.stopAnimations.add( function () {
	// editor.startAnimations();
		editor.animationMode = 0;
		stopAnimate();
	} );
	
	
	signals.changeColorScheme.add( function ( type ) {
			
		editor.colorScheme = type;

			
		for ( var scene of scenes ) {
			if(type == 0 ) scene.background =  Config.colors.SCENEDARK;
			else scene.background =  Config.colors.SCENELIGHT;
			
			var wireframe = scene.children[1].children[0].children[0];
			editor.changeBufferGeometryColorScheme(wireframe,type);
			
			var axes = scene.children[1].children[0].children[1].children[0];
			editor.changeBufferGeometryColorScheme(axes,type);
			
			var labels = scene.children[1].children[0].children[1].children[1];
			editor.changeSpriteColorScheme(labels,type);
			
			renderAll();
		}

		
		
		
	
	
		
	} );



	signals.selectionModeChanged.add( function (type) {

		editor.selectionMode = type;
	});
	

	signals.objectAdded.add( function ( object ) {

		object.traverse( function ( child ) {

			objects.push( child );

		} );

	} );

	signals.screenShot.add(screenShot );

	signals.hideChild.add(function(parent, childName){
		var child;
		console.log(parent,childName);
		if(childName == 'wireframe') child = parent.children[1].children[0].children[0];
		
		else if(childName == 'axes') child = parent.children[1].children[0].children[1].children[0];
		
		else if(childName == 'labels') child = parent.children[1].children[0].children[1].children[1];
		
		if( child.visible == true) child.visible = false;
		else child.visible = true;
		renderAll();
	

	});

	function sceneResize(){
		scenes.forEach( function( scene ) {
			var camera = scene.userData.camera;
			var dom = scene.userData.element;

			camera.aspect = dom.offsetWidth / dom.offsetHeight;
			camera.updateProjectionMatrix();
			// render(scene);
	
		});
	}


	function stopAnimate() {

		cancelAnimationFrame( animationLoopId );

	}


	function animate(timestamp) {
	
		animationLoopId = requestAnimationFrame( animate );
		TWEEN.update(timestamp);
		renderAll();
	}

	function renderAll() {

		renderer.setClearColor( 0xffffff );
		renderer.setScissorTest( false );
		renderer.clear();
		renderer.setClearColor( 0xe0e0e0 );
		renderer.setScissorTest( true );
		scenes.forEach( function( scene ) {

			render(scene);
		});
		

	}
	

	
	function screenShot(){
		
		var w = window.open('', '');
		w.document.title = "Screenshot";
		//w.document.body.style.backgroundColor = "red";
		// var t = editor.viewport.getContext('2d');
		// var img = new Image();
		// // Without 'preserveDrawingBuffer' set to true, we must render now
		// renderer.render(scenes[0], scenes[0].userData.camera);
		// img.src = renderer.domElement.toDataURL();
		w.document.body.appendChild(editor.viewport.toDataURL());  
	}

	
	function render(scene){
		var element = scene.userData.element;
		if(element.style.display == 'none') return;
		// get its position relative to the page's viewport
		var rect = element.getBoundingClientRect();
		// check if it's offscreen. If so skip it
		if ( rect.bottom < 0 || rect.top  > renderer.domElement.clientHeight ||
		rect.right  < 0 || rect.left > renderer.domElement.clientWidth ) {
		return;  // it's off screen
		}
		// set the viewport
		var width  = rect.right - rect.left;
		var height = rect.bottom - rect.top;
		var left   = rect.left;
		var top    = rect.top;
		renderer.setViewport( left, top, width, height );
		renderer.setScissor( left, top, width, height );
		var camera = scene.userData.camera;
		//camera.aspect = width / height; // not changing in this example
		//camera.updateProjectionMatrix();
		// scene.userData.orbitControls.update();
		renderer.render( scene, camera );
		
		
		
	}


	

};
