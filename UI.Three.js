UI.Three = function(demoName, width, height){
	this.materials;
	this.ctrl;
	this.rndr;
	this.scene;
	this.camera;

	this.init(demoName, width, height);

	$(window).resize(function(){
		var width = $('#'+demoName).width(),
			height = $('#'+demoName).height();
		this.rndr.setSize(width, height);
		this.camera.aspect = width/height;
		this.camera.updateProjectionMatrix();
	}.bind(this));
}

UI.Three.prototype.constructor = UI.Three;

UI.Three.prototype.initControl = function(demoName){
	this.ctrl = new THREE.TrackballControls(this.camera, $("#"+demoName).get(0));
	this.ctrl.rotateSpeed = 1.0;
	this.ctrl.zoomSpeed = 1.2;
	this.ctrl.panSpeed = 0.8;
	this.ctrl.noZoom = false;
	this.ctrl.noPan = false;
	this.ctrl.staticMoving = false;

	this.ctrl.dynamicDampingFactor = 0.3;	
};

UI.Three.prototype.resetControl = function(){
	new TWEEN.Tween( camera.position ).to( {
	        x: 0,
	        y: 0,
	        z: 200}, 600 )
	    .easing( TWEEN.Easing.Sinusoidal.EaseInOut).start();
}

UI.Three.prototype.initRenderer = function(demoName, width, height){
	this.rndr = new THREE.WebGLRenderer({
		alpha:true,
		antialias: true
	});
	$("#"+demoName).get(0).appendChild( this.rndr.domElement );

	this.rndr.setPixelRatio(window.devicePixelRatio);
	this.rndr.setSize( width, height);
	this.rndr.setClearColor( 0xfafafa, 1);
}

UI.Three.prototype.initScene = function(width, height){
	this.camera = new THREE.PerspectiveCamera( 20, width / height, 10, 1000 );
	this.camera.position.set(0, 0, 200);

	var light = new THREE.DirectionalLight( 0xe0e0e0, 1 );
    	light.position = this.camera.position;
    
    this.camera.add( light );

	this.scene = new THREE.Scene();
	this.scene.add(this.camera);

}

UI.Three.prototype.render = function(){
	this.rndr.render(this.scene, this.camera);
}

UI.Three.prototype.animate = function(){
	var that = this;
	requestAnimationFrame(function(){
		that.animate();
		that.ctrl.update();
		that.render();
    });	
}

UI.Three.prototype.init = function(demoName, width, height) {
	if(width){
		this.initScene(width, height);
		this.initRenderer(demoName, width, height);
		this.initControl(demoName, width, height);

	} else {
		var width = $('#'+demoName).width(),
			height = $('#'+demoName).height();
		this.initScene(width, height);
		this.initRenderer(demoName, width, height);
		this.initControl(demoName, width, height);
	}

	
	this.render();
	this.animate();
}

UI.Three.prototype.resize = function(demoName){
	var width = $('#'+demoName).width(),
		height = $('#'+demoName).height();
	this.rndr.setSize(width, height);
}

UI.Three.prototype.update = function(model){

}