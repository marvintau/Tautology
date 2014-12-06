(function(window, document, Math, undef){
	var camera, scene, renderer, canvas, controller;

	var bentStrawRadius = 2.5,
		bentStrawRadiusResolution = 16,
		bentStrawBellowRadius = 10,
		bentStrawBellowResolution = 16,
		bentStrawShortLength = 10,
		bentStrawLongLength = 40,
		bentStrawBellowAngle = Math.PI/3,
		bentStrawBellowOffset = new THREE.Vector3(0.4, 0, 0.6);


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

	var generateStrawVertices = function (strawResolution, bellowResolution) {
		var vertices = new Tautology.VectorArray(scene);
			vertices.init([new THREE.Vector3(0, 0, 0)]);
			vertices.dup(strawResolution+1);
			vertices.flatten();
			vertices.dup(bellowResolution*2+1);

		return vertices;
	}

	var updateStrawVertices2 = function (vertices,
										bentStrawRadius,
										bentStrawRadiusResolution,
										bentStrawBellowRadius,
										bentStrawBellowResolution,
										bentStrawShortLength,
										bentStrawLongLength,
										bentStrawBellowAngle,
										bentStrawBellowOffset,
										geom){
		vertices.applyFunc(function(){
			(geom != undefined) && (geom.verticesNeedUpdate = true);

			// Reset the point
			this.object.set(0, 0, 0);

			// Make the points move away from center to represent the short straight part
			this.index.index[0] == 0 && this.object.add(new THREE.Vector3(-bentStrawShortLength, 0, 0));

			// Make the points move away from center to represent the long straight part
			if(this.index.index[0] == bentStrawBellowResolution*2) {
				this.object.add(new THREE.Vector3(bentStrawLongLength, 0, 0));
			} ;

			// Move the points away from the straw centroid axis to represent the radius
			this.object.add(new THREE.Vector3(0, 0, bentStrawRadius));

			// Move the points with odd index over bellow resolution dimension to form the bellow
			if(this.index.index[0] > 1 && this.index.index[0] < bentStrawBellowResolution*2 && ((this.index.index[0] & 1)==0)){
				this.object.add(bentStrawBellowOffset);	
			}
		
			// Rotate the points around the straw centroid axis to form the straw
			this.object.applyAxisAngle(new THREE.Vector3(1, 0, 0), 2*Math.PI*this.index.index[1]/bentStrawRadiusResolution);		

			// Move the whole straw further to make the curved bellow.
			this.object.add(new THREE.Vector3(0, bentStrawBellowRadius, 0));

			// Let the bellow part rotate around the axis which the bellow curved around.
			with({index : this.index.index}){
				if(index[0] > 1 && index[0] < bentStrawBellowResolution*2){
					this.object.applyAxisAngle(new THREE.Vector3(0, 0, 1), -bentStrawBellowAngle*index[0]/(bentStrawBellowResolution*2));
				}
				if(index[0] == bentStrawBellowResolution*2){
					this.object.applyAxisAngle(new THREE.Vector3(0, 0, 1), -bentStrawBellowAngle*index[0]/(bentStrawBellowResolution*2));
				}
			}

		});
		// vertices.transpose([1,0]);
	}

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
		console.log($("#threeport").get(0));
		$("#threeport").get(0).appendChild( renderer.domElement );

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
		
		renderer.render( scene, camera );
		canvas.backgroundColor = 'rgba(255,255,255, 1)';

		document.getElementById("")
		
		vertices = generateStrawVertices(16, 16);
		updateStrawVertices2(vertices,
							bentStrawRadius,
							bentStrawRadiusResolution,
							bentStrawBellowRadius,
							bentStrawBellowResolution,
							bentStrawShortLength,
							bentStrawLongLength,
							bentStrawBellowAngle,
							bentStrawBellowOffset);

		g = new THREE.Geometry();
		g.vertices = vertices.array.elems.map(function(elem){ return elem.object });
		scene.add(new THREE.PointCloud(g));
		
		m = new Tautology.MeshGeometry(vertices.array, 0, 1, 0, 1);
		m.generateGeom(true);
		
		scene.add(new THREE.Mesh(m.geom, inside));
		scene.add(new THREE.Mesh(m.geom, outside));

		$("#radius").on("input change", function(e) {
			bentStrawRadius = 5 * e.target.valueAsNumber/100;
			updateStrawVertices2(vertices,
							bentStrawRadius,
							bentStrawRadiusResolution,
							bentStrawBellowRadius,
							bentStrawBellowResolution,
							bentStrawShortLength,
							bentStrawLongLength,
							bentStrawBellowAngle,
							bentStrawBellowOffset);			
			g.verticesNeedUpdate = true;
			m.geom.verticesNeedUpdate = true;
		});


		$("#bradius").on("input change", function(e) {
			bentStrawBellowRadius = e.target.valueAsNumber;
			updateStrawVertices2(vertices,
							bentStrawRadius,
							bentStrawRadiusResolution,
							bentStrawBellowRadius,
							bentStrawBellowResolution,
							bentStrawShortLength,
							bentStrawLongLength,
							bentStrawBellowAngle,
							bentStrawBellowOffset);			
			g.verticesNeedUpdate = true;
			m.geom.verticesNeedUpdate = true;
		});

		$("#angle").on("input change", function(e) {
			bentStrawBellowAngle = e.target.valueAsNumber/180 * Math.PI;
			updateStrawVertices2(vertices,
							bentStrawRadius,
							bentStrawRadiusResolution,
							bentStrawBellowRadius,
							bentStrawBellowResolution,
							bentStrawShortLength,
							bentStrawLongLength,
							bentStrawBellowAngle,
							bentStrawBellowOffset);			
			g.verticesNeedUpdate = true;
			m.geom.verticesNeedUpdate = true;
		});

	});

})(window, window.document, Math);

