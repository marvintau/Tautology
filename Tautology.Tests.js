var param = {
	
	bellowResolution : 23,
	circumResolution: 30,
	length: 1,
	radius: 8,
	transAngle: Math.PI/29,
	lengthAngle: Math.PI/90,

	axisX : new THREE.Vector3(1, 0, 0),
	axisZ : new THREE.Vector3(0, 0, 1),

	get shape() {
		return [this.bellowResolution, this.circumResolution]
	},

	get trans() {
		return new THREE.Vector3(0, -Math.sin(this.transAngle)*this.radius, 0);
	},

	get leng() {
		return new THREE.Vector3(this.length, 0, 0);
	},

	get transRollMatrix() {
		return THREE.Matrix4.makeRollMatrix(this.axisX, 2*this.transAngle, this.trans);
	},

	get lengRollMatrix() {
		return THREE.Matrix4.makeRollMatrix(this.axisZ, 2*this.lengthAngle, this.leng);
	}
};

var code = function(param, array){

	for (var i = this.length - 1; i >= 0; i--) {
		this[i].set(0, 0, 0);
		if (array[i][0]== 0)
			this[i].add(new THREE.Vector3(-20, 0, 0));
		else if (array[i][0]== param.bellowResolution-1)
			this[i].add(new THREE.Vector3(20, 0, 0));
		else
			this[i].add(new THREE.Vector3(((array[i][0]+1)%2)+0.3, 0, (array[i][0]+1)%2));

		this[i].roll(array[i][1], param.transRollMatrix);
		this[i].roll(array[i][0], param.lengRollMatrix);

	};
	
}

geometry = new Tautology.Geometry(param, code);

var setMaterials = function(){
	material={};

	material['outside'] = new THREE.MeshLambertMaterial({
    	color:0xffffff,
		opacity: 0.5,
		transparent: true,
		side: THREE.FrontSide,
		_needsUpdate: true
	}); 

    material['inside'] = new THREE.MeshLambertMaterial({
    	color:0xffffff,
		opacity: 0.5,
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

	light = new THREE.DirectionalLight( 0xe0e0e0, 1 );
    light.position = camera.position;
    camera.add( light );

	scene = new THREE.Scene();
	// scene.add(new THREE.AmbientLight(0x222222));
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
	// scene.add(new THREE.PointCloud(geometry.geom));

	render();
	animate();
}

var change = function(slider){
    var sliderValue = document.getElementById(slider);
    console.log(sliderValue);
}

init();

window.document.querySelector('input').addEventListener('change', change);