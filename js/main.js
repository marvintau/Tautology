var camera, scene, renderer, canvas;

(function(window, document, Math, undef){
	
	var bentStrawRadius = 2.5,
		bentBellowRadius = 10,
		bentShortLength = 10,
		bentLongLength = 40,
		bentBellowAngle = Math.PI/3;


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
	
	var generateShortGeometry = function (strawRadius, bellowRadius, strawShortLength, left, width){
		var part = new Tautology.VectorArray(scene);

			part.init([new THREE.Vector3(0, 0, strawRadius)]);
			part.rotateStepwise(new THREE.Vector3(1, 0, 0), Math.PI*2, Math.floor(10*strawRadius));
			part.flatten();
			part.output();
			part.translateStepwise(new THREE.Vector3(-strawShortLength, 0, 0), 1);
			part.translate(new THREE.Vector3(0, bellowRadius, 0));
			part.transpose([1,0]);


		var m = new Tautology.MeshGeometry(part.array, left, width, 0, 1);
			delete part;
			m.generateGeom();

		return m.geom;
	};

	var generateLongGeometry = function (strawRadius, bellowRadius, strawLongLength, bellowAngle, left, width){
		var part = new Tautology.VectorArray(scene);

			part.init([new THREE.Vector3(0, 0, strawRadius)]);
			part.rotateStepwise(new THREE.Vector3(1, 0, 0), Math.PI*2, Math.floor(10*strawRadius));
			part.flatten();
			part.output();
			part.translateStepwise(new THREE.Vector3(strawLongLength, 0, 0), 1);
			part.translate(new THREE.Vector3(0, bellowRadius, 0));
			part.rotate(new THREE.Vector3(0, 0, 1), -bellowAngle, Math.floor(bellowRadius/10*8));
			part.transpose([1,0]);

		var m = new Tautology.MeshGeometry(part.array, left, width, 0, 1);
			delete part;
			m.generateGeom();

		return m.geom;
	};

	var generateBellowGeometry = function (strawRadius, bellowRadius, bellowAngle, left, width){
		var bellow = new Tautology.VectorArray();

			bellow.init([new THREE.Vector3(0, 0, strawRadius)]);
			bellow.translateStepwise(new THREE.Vector3(.4, 0, .6), 1);
			bellow.flatten();
			bellow.rotateStepwise(new THREE.Vector3(1, 0, 0), Math.PI*2, Math.floor(8*strawRadius));
			bellow.translate(new THREE.Vector3(0, bellowRadius, 0));
			bellow.rotateStepwise(new THREE.Vector3(0, 0, 1), -bellowAngle, Math.floor(bellowRadius/10*8));
			bellow.transpose([0, 2, 1]);
			bellow.flatten();
			bellow.transpose([1,0]);

		var m = new Tautology.MeshGeometry(bellow.array, left, width, 0, 1);
			delete bellow;
			m.generateGeom();

		return m.geom;
	};

	function generateBentStraw(scene, strawRadius, bellowRadius, bellowAngle, shortLength, longLength){
		var total = shortLength + bellowRadius * bellowAngle + longLength,
			shortLeft = shortLength / total,
			shortWidth = -shortLength / total,
			bellowLeft = shortLength / total,
			bellowWidth = bellowRadius * bellowAngle / total,
			longLeft = bellowLeft + bellowWidth,
			longWidth = longLength / total;

		var geomShort = generateShortGeometry(strawRadius, bellowRadius, shortLength, shortLeft, shortWidth);
		var geomBellow = generateBellowGeometry(strawRadius, bellowRadius, bellowAngle, bellowLeft, bellowWidth);
		var geomLong = generateLongGeometry(strawRadius, bellowRadius, longLength, bellowAngle, longLeft, longWidth);

		scene.remove(scene.children[1]);
	    packedGeom = new THREE.Object3D();
		packedGeom.add(new THREE.Mesh(geomBellow, outside));
		packedGeom.add(new THREE.Mesh(geomShort, inside));
		packedGeom.add(new THREE.Mesh(geomLong, outside));

		packedGeom.add(new THREE.Mesh(geomBellow, inside));
		packedGeom.add(new THREE.Mesh(geomShort, outside));
		packedGeom.add(new THREE.Mesh(geomLong, inside));

		scene.add(packedGeom);

	};


	var set2DCanvas = function(){
		canvas = new fabric.Canvas('viewport');

	    if( window.devicePixelRatio !== 1 ){
	        var c = canvas.getElement(); // canvas = fabric.Canvas
	        
	        var w = c.width, h = c.height;
	 
	        c.setAttribute('width', w*window.devicePixelRatio);
	        c.setAttribute('height', h*window.devicePixelRatio);
	        c.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);
	 
	    }

		var rect = new fabric.Rect({
			left: 100,
			top: 100,
			fill: 'red',
			width: 50,
			height: 40
		});

		canvas.add(rect);
	};

	var ControlManager = (function(){

		function ControlManager(camera, render_elem){
			this.controller = new THREE.TrackballControls(camera, render_elem);
			this.controller.rotateSpeed = 1.0;
			this.controller.zoomSpeed = 1.2;
			this.controller.panSpeed = 0.8;
			this.controller.noZoom = false;
			this.controller.noPan = false;
			this.controller.staticMoving = false;
			this.controller.dynamicDampingFactor = 0.1;	
		};

		ControlManager.prototype = {
			bind: function(render){
		        this.controller.addEventListener( 'change', render );
			},
			update: function(){
		        this.controller.update();
			}
		};

		return ControlManager;
	})();

	var setCameraAndLight = function(){
		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
		camera.position.set(0, 0, 200);

		light = new THREE.PointLight( 0xf2f2f2, 1 );
        light.position = camera.position;
        camera.add( light );

	}

	function init(){

		set2DCanvas();
		
		setTexture();
		
		setMaterials();

		setCameraAndLight();

		scene = new THREE.Scene();
		scene.add(camera);

		renderer = new THREE.WebGLRenderer({alpha:true, antialias: true });
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.sortObjects = true;
		$("#threeport").get(0).appendChild( renderer.domElement );

		// ControlManager();
		control = new ControlManager(camera, renderer.domElement);
		control.bind(render);

		render();
	}

	function animate() {
	    requestAnimationFrame( animate );
	    control.update();
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
		$('#commandline').autosize();
		$('#commandline').addClass('textarea-transition');
		
		renderer.render( scene, camera );
		canvas.backgroundColor = 'rgba(255,255,255, 1)';

		generateBentStraw(scene, bentStrawRadius, bentBellowRadius, bentBellowAngle, bentShortLength, bentLongLength);

		$("#radius").change(function(e){
			bentStrawRadius = 8 * e.target.valueAsNumber/100;
			generateBentStraw(scene, bentStrawRadius, bentBellowRadius, bentBellowAngle, bentShortLength, bentLongLength);
		});

		$("#angle").change(function(e){
			bentBellowAngle = e.target.valueAsNumber/180 * Math.PI;
			generateBentStraw(scene, bentStrawRadius, bentBellowRadius, bentBellowAngle, bentShortLength, bentLongLength);
		});		

		$("#bradius").change(function(e){
			bentBellowRadius = e.target.valueAsNumber;
			generateBentStraw(scene, bentStrawRadius, bentBellowRadius, bentBellowAngle, bentShortLength, bentLongLength);
		});	

		$("#short").change(function(e){
			bentShortLength = e.target.valueAsNumber;
			generateBentStraw(scene, bentStrawRadius, bentBellowRadius, bentBellowAngle, bentShortLength, bentLongLength);
		});		

		$("#long").change(function(e){
			bentLongLength = e.target.valueAsNumber;
			generateBentStraw(scene, bentStrawRadius, bentBellowRadius, bentBellowAngle, bentShortLength, bentLongLength);
		});		

	});

})(window, window.document, Math);



