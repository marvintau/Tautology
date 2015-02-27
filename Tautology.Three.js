Tautology.Three = function(){
	this.materials;
	this.ctrl;
	this.rndr;
	this.scene;
	this.camera;
}

Tautology.Three.prototype.constructor = Tautology.Three;

Tautology.Three.prototype.initMaterials = function(){
	this.materials={};

	this.materials['outside'] = new THREE.MeshLambertMaterial({
    	color:0xffffff,
		opacity: 0.5,
		transparent: true,
		side: THREE.FrontSide,
		_needsUpdate: true
	}); 

    this.materials['inside'] = new THREE.MeshLambertMaterial({
    	color:0xffffff,
		opacity: 0.5,
		transparent: true,
		side: THREE.BackSide,
		_needsUpdate: true
	}); 	

};

Tautology.Three.prototype.initControl = function(){
	this.ctrl = new THREE.TrackballControls(this.camera, window.document.querySelector('canvas'));
	this.ctrl.rotateSpeed = 1.0;
	this.ctrl.zoomSpeed = 1.2;
	this.ctrl.panSpeed = 0.8;
	this.ctrl.noZoom = false;
	this.ctrl.noPan = false;
	this.ctrl.staticMoving = false;

	this.ctrl.dynamicDampingFactor = 0.3;	
};

Tautology.Three.prototype.initRenderer = function(element){
	this.rndr = new THREE.WebGLRenderer({alpha:true, antialias: true });
	element.appendChild( this.rndr.domElement );
	this.rndr.setSize( 800, 600);
	this.rndr.setClearColor( 0xfafafa, 1);
}

Tautology.Three.prototype.initScene = function(){
	this.camera = new THREE.PerspectiveCamera( 45, 800 / 600, 1, 1000 );
	this.camera.position.set(0, 0, 100);

	var light = new THREE.DirectionalLight( 0xe0e0e0, 1 );
    	light.position = this.camera.position;
    
    this.camera.add( light );

	this.scene = new THREE.Scene();
	this.scene.add(this.camera);

}

Tautology.Three.prototype.render = function(){
	this.rndr.render(this.scene, this.camera);
}

Tautology.Three.prototype.animate = function(){
	var that = this;
    requestAnimationFrame(function(){
    	that.animate();
    	that.ctrl.update();
    });
    
    that.render();

}

Tautology.Three.prototype.init = function() {
	this.initScene();
	this.initRenderer(window.document.body);
	this.initControl();
	this.initMaterials();
	
	this.render();
	this.animate();
}

Tautology.Three.prototype.updateScene = function() {
	this.scene.add(new THREE.Mesh(geometry.geom, this.materials['inside']));
	this.scene.add(new THREE.Mesh(geometry.geom, this.materials['outside']));
}