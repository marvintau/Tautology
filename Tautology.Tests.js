param = {
	shape: [5, 30],
	length: 1,
	radius: 1,
	bent: 1.
};

codes =
[	{	description: 'translate the vertices over length direction',
		func: function(param){
			this.vec.add(new THREE.Vector3(this.idx[0]*param.length, 0, 0));
		}
	},
	{	name: 'roll the vertices to form the tube',
		func: function(param){
			var theta = Math.PI/(param.shape[1]-1),
				axis  = new THREE.Vector3(1, 0, 0),
				trans = new THREE.Vector3(0, Math.sin(theta)*param.radius, 0);
			// this.vec.applyAxisAngle(new THREE.Vector3(1, 0, 0), this.idx[1]/(param.shape[1]-1)*2*Math.PI);
			this.vec.roll(this.idx[1], 2*theta, axis, trans);
		}
	}
];

geometry = new Tautology.Geometry(param, codes);

var setMaterials = function(){
	material={};

	material['outside'] = new THREE.MeshLambertMaterial({
    	color:0xffffff,
		opacity: 0.6,
		transparent: true,
		side: THREE.FrontSide,
		_needsUpdate: true
	}); 

    material['inside'] = new THREE.MeshLambertMaterial({
    	color:0xffffff,
		opacity: 0.6,
		transparent: true,
		side: THREE.BackSide,
		_needsUpdate: true
	}); 	

};

var setControl = function(){
	ctrl = new THREE.TrackballControls(camera, window.document);
	ctrl.rotateSpeed = 1.0;
	ctrl.zoomSpeed = 1.2;
	ctrl.panSpeed = 0.8;
	ctrl.noZoom = false;
	ctrl.noPan = false;
	ctrl.staticMoving = false;

	ctrl.dynamicDampingFactor = 0.3;	

    ctrl.addEventListener( 'change', render );
};


// Render
var setRenderer = function(){
	rndr = new THREE.WebGLRenderer({alpha:true, antialias: true });
	window.document.body.appendChild( rndr.domElement );
	rndr.setSize( 800, 600);
	rndr.setClearColor( 0xfafafa, 1);

}

var setScene = function(){
	camera = new THREE.PerspectiveCamera( 45, 800 / 600, 1, 1000 );
	camera.position.set(0, 0, 100);

	light = new THREE.PointLight( 0xf2f2f2, 1 );
    light.position = camera.position;
    camera.add( light );

	scene = new THREE.Scene();
	scene.add(camera);

}

var render = function() {
	rndr.render( scene, camera );
}

var animate = function() {
    requestAnimationFrame( animate );
    ctrl.update();
    render();
}

var init = function() {
	setScene();
	setControl();
	setRenderer();
	setMaterials();
	
	scene.add(new THREE.Mesh(geometry.geom, material['inside']));
	scene.add(new THREE.Mesh(geometry.geom, material['outside']));

	render();
	animate();
}


init();
