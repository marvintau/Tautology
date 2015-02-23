var param = {
	
	bellowResolution : 23,
	circumResolution: 30,
	bellowLength: {min:0.75, max:1.5, val:0.8},
	radius: {min: 8, max:12, val:10},
	stubLength : {min:10, max:20, val:10},
	bodyLength : {min:25, max:35, val:25},
	transAngle: {min:0, max: Math.PI/29, val:Math.PI/29},
	lengthAngle: {min:0, max: Math.PI/50, val:Math.PI/80},

	get shape() {
		return [this.bellowResolution, this.circumResolution]
	},

	get trans() {
		return new THREE.Vector3(0, -Math.sin(this.transAngle.val)*this.radius.val, 0);
	},

	get leng() {
		return new THREE.Vector3(this.bellowLength.val, 0, 0);
	},

	get transRollMatrix() {
		return THREE.Matrix4.makeRollMatrix(
			new THREE.Vector3(1, 0, 0),
			2*this.transAngle.val,
			this.trans
		);
	},

	get lengRollMatrix() {
		return THREE.Matrix4.makeRollMatrix(
			new THREE.Vector3(0, 0, 1),
			2*this.lengthAngle.val,
			this.leng
		);
	}
};

var code = function(param, array){

	for (var i = this.length - 1; i >= 0; i--) {
		this[i].set(0, 0, 0);
		if (array[i][0]== 0)
			this[i].add(new THREE.Vector3(-param.stubLength.val, 0, 0));
		else if (array[i][0]== param.bellowResolution-1)
			this[i].add(new THREE.Vector3(param.bodyLength.val, 0, 0));
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

var addSlider = function(parameter, params){
	// var input = $('body').append();
	$('<input type="range">').appendTo($('body'))
		.attr({
			id: parameter,
			min:params[parameter]['min']*2000,
			max:params[parameter]['max']*2000,
			val:params[parameter]['val']*2000
		}).on('input change', function(e){
			params[parameter]['val'] = $(this).val()/2000;
			// console.log(geometry.param[parameter]);
			geometry.update();
		});
}

// init();

addSlider('radius', param);
addSlider('transAngle', param);
addSlider('lengthAngle', param);
addSlider('bellowLength', param);
addSlider('stubLength', param);
addSlider('bodyLength', param);