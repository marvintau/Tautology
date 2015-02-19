param = {
	shape: [30, 30],
	length: 1,
	radius: 3,
	theta: Math.PI/29,
	phi: Math.PI/29
};

var code = function(param){
	var axisRoll = new THREE.Vector3(1, 0, 0),
		axisBend = new THREE.Vector3(0, 0, 1),
		trans = new THREE.Vector3(0, Math.sin(Math.PI/29)*param.radius, 0);
		leng = new THREE.Vector3(param.length, 0, 0);
	// this.vec.add(new THREE.Vector3(this.idx[0]*param.length, 0, 0));
	this.vec.roll(this.idx[1], 2*param.theta, axisRoll, trans);
	this.vec.roll(this.idx[0], 2*param.phi, axisBend, leng);
	
}


geometry = new Tautology.Geometry(param, code);

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
	ctrl = new THREE.TrackballControls(camera, window.document.querySelector('canvas'));
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
	setRenderer();
	setControl();
	setMaterials();
	
	scene.add(new THREE.Mesh(geometry.geom, material['inside']));
	scene.add(new THREE.Mesh(geometry.geom, material['outside']));

	render();
	animate();
}

var change = function(slider){
    var sliderValue = document.getElementById (slider.id);
    console.log(sliderValue);
}

init();

window.document.querySelector('input').addEventListener('oninput', change);