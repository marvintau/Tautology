(function(window, document, Math, undef){
	var camera, scene, renderer, canvas, controller;

	var setTexture = function(){
		texture = new THREE.Texture( canvas.getElement() );
		texture.repeat = new THREE.Vector2(-1, -1);
		texture.offset = new THREE.Vector2(1,1);
		texture.needsUpdate = true;
	};

	var setMaterials = function(){
		outside = new THREE.MeshLambertMaterial({
	    	color:0xaaaaaa,
			opacity: 0.6,
			transparent: true,
			side: THREE.FrontSide,
			map: texture,
			_needsUpdate: true
		}); 

	    inside = new THREE.MeshLambertMaterial({
	    	color:0xaaaaaa,
			opacity: 0.6,
			transparent: true,
			side: THREE.BackSide,
			map: texture,
			_needsUpdate: true
		}); 	
	};


	var set2DCanvas = function(){
		canvas = new fabric.Canvas('viewport');

	    // if( window.devicePixelRatio !== 1 ){
	        var c = canvas.getElement(); // canvas = fabric.Canvas
	        
	        var w = c.width, h = c.height;
	 
	        c.style.width ='100%';
			c.style.height='100%';
			  // ...then set the internal size to match
			c.width  = canvas.offsetWidth;
			c.height = canvas.offsetHeight;

	        c.setAttribute('width', w*window.devicePixelRatio);
	        c.setAttribute('height', h*window.devicePixelRatio);
	        c.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);
	 
	    // }

		var rect = new fabric.Rect({
			left: 100,
			top: 100,
			fill: 'red',
			width: 50,
			height: 40
		});

		canvas.add(rect);
	};

	var setControl = function(){
		controller = new THREE.TrackballControls(camera, $('#threeport').get(0));
		controller.rotateSpeed = 1.0;
		controller.zoomSpeed = 1.2;
		controller.panSpeed = 0.8;
		controller.noZoom = false;
		controller.noPan = false;
		controller.staticMoving = false;
		controller.dynamicDampingFactor = 0.1;	

        controller.addEventListener( 'change', render );
	};


	var setCameraAndLight = function(){
		camera = new THREE.PerspectiveCamera( 45, $("#threeport").width() / $("#threeport").height(), 1, 1000 );
		camera.position.set(0, 0, 200);

		light = new THREE.PointLight( 0xf2f2f2, 1 );
        light.position = camera.position;
        camera.add( light );

	}

	function init(){

		set2DCanvas();
		
		setTexture();
		
		setMaterials();

		renderer = new THREE.WebGLRenderer({alpha:true, antialias: true });
		$("#threeport").get(0).appendChild( renderer.domElement );

		renderer.setSize( $("#threeport").width(), $("#threeport").height() );
		renderer.sortObjects = true;

		setCameraAndLight();
		scene = new THREE.Scene();
		scene.add(camera);


		setControl();
		
		render();
	}

	function animate() {
	    requestAnimationFrame( animate );
	    controller.update();
	    render();
	}

	function render() {
		texture.needsUpdate = true;
		renderer.render( scene, camera );
	}

	init()
	animate();


	$(document).ready( function(){
		$('viewport').attr('width', window.innerWidth);
		canvas.backgroundColor = 'rgba(255,255,255, 1)';
		canvas.renderAll();
		
		render();

		straw = {};
		straw['straight'] = new Tautology.StraightStraw(scene);
		straw['bent'] = new Tautology.BentStraw(scene);
		straw['spoon'] = new Tautology.SpoonStraw(scene);
		straw['straight'].init(outside, inside);
		straw['bent'].init(outside,inside);
		straw['spoon'].init(outside, inside);
		straw['straight'].addModel();

		// spoonStraw.init(outside, inside);
		function toggleStraw(prev, next){
			straw[prev].removeModel();
			straw[next].addModel();
		}


		$("#straw-selector-tab").tab();

		$("#straight-tab").on('hide.bs.tab', function(e){
			toggleStraw((e.target.id.split('-'))[0], (e.relatedTarget.id.split('-'))[0]);
		});

		$("#bent-tab").on('hide.bs.tab', function(e){
			toggleStraw((e.target.id.split('-'))[0], (e.relatedTarget.id.split('-'))[0]);
		});

		$("#spoon-tab").on('hide.bs.tab', function(e){
			toggleStraw((e.target.id.split('-'))[0], (e.relatedTarget.id.split('-'))[0]);
		});


		$("#straight-radius-slider").on("input change", function(e) {
			straw['straight'].updateRadius(e.target.valueAsNumber/10);
		});


		$("#straight-length-slider").on("input change", function(e) {
			straw['straight'].updateLength(e.target.valueAsNumber/2);
			
		});

		$("#bent-radius-slider").on("input change", function(e) {
			straw['bent'].updateRadius(e.target.valueAsNumber/10);
			
		});

		$("#bent-stub-length-slider").on("input change", function(e) {
			straw['bent'].updateShortLength(e.target.valueAsNumber/10);
			
		});

		$("#bent-body-length-slider").on("input change", function(e) {
			straw['bent'].updateLongLength(e.target.valueAsNumber/10);
		});

		$("#bent-curvature-slider").on("input change", function(e) {
			straw['bent'].updateCurvature(e.target.valueAsNumber/100*Math.PI);
		});

		$("#spoon-radius-slider").on("input change", function(e) {
			straw['spoon'].updateRadius(e.target.valueAsNumber/10);
		});


		$("#spoon-length-slider").on("input change", function(e) {
			straw['spoon'].updateLength(e.target.valueAsNumber/2);
			
		});


	});

})(window, window.document, Math);

