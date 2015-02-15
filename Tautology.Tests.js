param = {
	shape: [10, 10],
	cons:function(){return Tautology.Point;}
};

codes =
[	{	name: 'trans',
		func: function(param){
			this.vec.add(new THREE.Vector3(this.idx[0]*2, 2, 0));
		}
	},
	{	name: 'rot',
		func: function(param){
			this.vec.applyAxisAngle(new THREE.Vector3(1, 0, 0), this.idx[1]/param.shape[1]*2*Math.PI);
		}
	}
];

geometry = new Tautology.Geometry(param, codes);
geometry.init();

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
	rndr.setSize( window.innerWidth, window.innerHeight);
	rndr.setClearColor( 0xfafafa, 1);

}

var setScene = function(){
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
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
	scene.add(new THREE.PointCloud(geometry.geom));

	render();
	animate();
}


init();
