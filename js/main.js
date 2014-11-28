var camera, scene, renderer, canvas;

(function(window, document, Math, undef){
	
	var setup_canvas = function(){
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

	function init(){
		setup_canvas();

		texture = new THREE.Texture( canvas.getElement() );
		texture.repeat = new THREE.Vector2(-1, -1);
		texture.offset = new THREE.Vector2(1,1);
		texture.needsUpdate = true;

		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
		camera.position.set(0, 0, 200);

		light = new THREE.PointLight( 0xf2f2f2, 1 );
        // light.shadowCameraVisible = true;
        light.position = camera.position;
        camera.add( light );

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
		
		test(scene);

		renderer.render( scene, camera );
		canvas.backgroundColor = 'rgba(255,255,255, 1)';

		$(document).mousemove(function(e){
			m.setVertex(8, 13, new THREE.Vector3(e.pageX/10, 10, 10));
		})
	});

})(window, window.document, Math);

function test(scene){
	q = new Tautology.Query();

	q.register(function(q){return q == "X";},
					 function(i, q){return true;});

	q.register(function(q){return q == "even"},
			   function(i, q){return i % 2 == 0});

	a = new Tautology.VectorArray(scene);

	a.init([new THREE.Vector3(0, 0, 3)]);
	a.translateStepwise(new THREE.Vector3(.4, 0, -.6), 1);
	a.flatten();
	a.rotateStepwise(new THREE.Vector3(1, 0, 0), Math.PI*2, 8);
	a.translate(new THREE.Vector3(0, 10, 0));
	a.rotateStepwise(new THREE.Vector3(0, 0, 1), -Math.PI/3, 8);
	a.transpose([0, 2, 1]);
	a.flatten();
	a.transpose([1,0]);
	// a.toggleLabel();
	// a.output();

	m = new Tautology.Geometry(a.array);
	m.generateGeom();
	// If the geometry instance in the geom really refers to the vertex in the vertextable, then if we
	// modify the vector stored in the vertextable, the vertices list in the geometry instance should be
	// modified as well.



	var outside = new THREE.MeshLambertMaterial({
    	color:0xaaaaaa,
		opacity: 0.6,
		transparent: true,
		side: THREE.FrontSide,
		map: texture,
		_needsUpdate: true
	}); 

    var inside = new THREE.MeshLambertMaterial({
    	color:0xaaaaaa,
		opacity: 0.6,
		transparent: true,
		side: THREE.BackSide,
		map: texture,
		_needsUpdate: true
	}); 

    var packedGeom = new THREE.Object3D();
	packedGeom.add(new THREE.Mesh(m.geom, outside));
	packedGeom.add(new THREE.Mesh(m.geom, inside));

	scene.add(packedGeom);
	
	// a.toggleLabel();
}