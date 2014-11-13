(function(window, document, Math, undef){
	var camera, scene, renderer;

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

	var CameraManager = (function(){
		function CameraManager(){
			this.camera = new THREE.PerspectiveCamera();
			this.camera.position.set(0, 0, 5);
			this.camera.fov = 45;
			this.camera.aspect = window.innerWidth / window.innerHight;
			this.camera.near = 0.1;
			this.camera.far = 1000;
		}

		CameraManager.prototype = {
			light: function(light){
				light.position.copy(this.camera.position);
				this.camera.add(light);
			}
		}

		return CameraManager;
	})();

	function init(){
		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
		camera.position.set(0, 0, 5);

	    var light = new THREE.PointLight( 0xffffff, 1, 0);
	        light.position.copy( camera.position );
	        camera.add( light );

		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	    var material = new THREE.MeshLambertMaterial({ color:0xaaaaaa,
	                                                   opacity: 0.6,
	                                                   transparent: true,
	                                                   _needsUpdate: true}); 
		var cube = new THREE.Mesh( geometry, material );

		scene = new THREE.Scene();


		// scene.add(cube);
		scene.add(camera);

		renderer = new THREE.WebGLRenderer({alpha:true, antialias: true });
		renderer.setSize( window.innerWidth, window.innerHeight );
		// renderer.autoClear = false;
		document.body.appendChild( renderer.domElement );

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
		renderer.render( scene, camera );
	}

	init()
	animate();

	$(document).ready( function(){
		$('#commandline').autosize();
		$('#commandline').addClass('textarea-transition');
		test(scene);
	});

})(window, window.document, Math);

function test(scene){
	a = new Tautology.VectorArray(scene);
	a.init([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)]);

	a.query.register(
		function(q){return Number.isInteger(q);},
		function(i, q){return i == q;}
	);
	a.query.register(
		function(q){return q.length == 2},
		function(i, q){return q[0]>=q[1] ? (i < q[0] || i >= q[1]) : (i >= q[0] && i <q[1])}
	);
	a.query.register(
		function(q){return q==="d";},
		function(i, q){return true;}
	);
	// console.log(p.match([0,1], [0,[0,1]]));

	a.dup(2);
	a.dup(2);
	// a.output();
	a.applyFunc(function(){this.object.setX(1);}, [1, "d", "d"]);
	a.applyFunc(function(){this.object.setY(1);}, ["d", 1, "d"]);
	a.applyFunc(function(){this.object.setZ(1);}, ["d", "d", 1]);
	a.output();

	// a.reshapeIndex(2);
	// console.log(a.sumIndex([2,2,2]));
	// console.log(a.index);
}