var Viewport = function ( editor ) {

	var signals = editor.signals;
	var canvas = editor.canvas;

	var fullScreenScene = editor.fullScreenScene;
 	var container  = this.container = editor.viewport;
	container.onscroll = function (e) {
		editor.signals.renderRequired.dispatch();
	};
	var scenes = editor.scenes;

	var renderer =  new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
	renderer.setClearColor( 0xffffff, 1 );
	renderer.setPixelRatio( window.devicePixelRatio );

	// var sceneHelpers = editor.sceneHelpers;
	function getIntersects( point, objects ) {

		mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );

		raycaster.setFromCamera( mouse, editor.camera );

		return raycaster.intersectObjects( objects );

	}

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

					editor.select( object );

				}

			} else {

				editor.select( null );

			}

			render();

		}

	}

	// events
	function onMouseDown( event ) {

		event.preventDefault();

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onDownPosition.fromArray( array );


		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseUp( event ) {

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onUpPosition.fromArray( array );

		handleClick();

		document.removeEventListener( 'mouseup', onMouseUp, false );

	}

	function onTouchStart( event ) {

		var touch = event.changedTouches[ 0 ];

		var array = getMousePosition( container.dom, touch.clientX, touch.clientY );
		onDownPosition.fromArray( array );

		document.addEventListener( 'touchend', onTouchEnd, false );

	}

	function onTouchEnd( event ) {

		var touch = event.changedTouches[ 0 ];

		var array = getMousePosition( container.dom, touch.clientX, touch.clientY );
		onUpPosition.fromArray( array );

		handleClick();

		document.removeEventListener( 'touchend', onTouchEnd, false );

	}
	// object picking
	function objectPicking(){
		var objects = editor.objects;
		var raycaster = new THREE.Raycaster();
		var mouse = new THREE.Vector2();
		

		var onDownPosition = new THREE.Vector2();
		var onUpPosition = new THREE.Vector2();
		var onDoubleClickPosition = new THREE.Vector2();


		container.dom.addEventListener( 'mousedown', onMouseDown, false );
		container.dom.addEventListener( 'touchstart', onTouchStart, false );

		
	}



	//SIGNALS
	signals.addScene.add(function (data,dim, axesName) {
		//TODO scene name
		editor.addScene(data,dim, axesName);

	});



	signals.windowResize.add( function () {


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




	signals.objectAdded.add( function ( object ) {

		object.traverse( function ( child ) {

			objects.push( child );

		} );

	} );



	signals.objectAdded.add( function ( object ) {

		object.traverse( function ( child ) {

			objects.push( child );

		} );

	} );

	signals.hideChild.add(function(parent, childName){
		var child;
		if(childName == 'wireframe') child = parent.children[3].children[0];
		
		else if(childName == 'axes') child = parent.children[3].children[1].children[0];
		
		else if(childName == 'labels') child = parent.children[3].children[1].children[1];
		

		if( child.visible == true) child.visible = false;
		else child.visible = true;
		renderAll();
	

	});

	function renderAll() {


		renderer.setClearColor( 0xffffff );
		renderer.setScissorTest( false );
		renderer.clear();
		renderer.setClearColor( 0xe0e0e0 );
		renderer.setScissorTest( true );
		scenes.forEach( function( scene ) {

		
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
			//scene.userData.controls.update();
			renderer.render( scene, camera );
		});
		

	}


	

};
