Tautology.StraightStraw = function(scene){
	this.resolution = 16;
	this.radius = 2.5;
	this.length = 50;
	this.vertices = new Tautology.VectorArray();
	this.geom = null;
	this.pack = new THREE.Object3D();
	this.scene = scene;
}

Tautology.StraightStraw.prototype = {
	constructor : Tautology.StraightStraw,

	init : function (outside, inside) {
		this.vertices.init([new THREE.Vector3(0, 0, 0)]);
		this.vertices.dup(this.resolution+1);
		this.vertices.flatten();
		this.vertices.dup(2);

		this.updateVertices();
		
		var mg = new Tautology.MeshGeometry(this.vertices.array, 0, 1, 0, 1);
		this.geom = mg.generateGeom(true);
		console.log(this.geom);
		this.pack.add(new THREE.Mesh(this.geom, inside));
		this.pack.add(new THREE.Mesh(this.geom, outside));
	},

	addModel : function(){
		this.scene.add(this.pack);
	},

	removeModel : function(){
		this.scene.remove(this.pack);
	},

	updateVertices : function(){
		_this = this;
		(this.geom != null) && (this.geom.verticesNeedUpdate = true);

		this.vertices.applyFunc(function(){
			this.object.set(0, 0, 0);
			this.index.index[0] == 0 && this.object.add(new THREE.Vector3(-_this.length/2, 0, 0));
			this.index.index[0] == 1 && this.object.add(new THREE.Vector3(_this.length/2, 0, 0));
			this.object.add(new THREE.Vector3(0, 0, _this.radius));
			this.object.applyAxisAngle(new THREE.Vector3(1, 0, 0),
									2*Math.PI*this.index.index[1]/_this.resolution);
		})
	},

	updateLength : function(length){
		this.length = length;
		this.updateVertices();
	},

	updateRadius : function(radius){
		this.radius = radius;
		this.updateVertices();
	}
}