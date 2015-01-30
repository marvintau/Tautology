Tautology.StraightStraw = function(scene, length, radius){
	this.resolution = 40;
	this.radius = (radius == undefined) && 2.5 || radius;
	this.length = (length == undefined) && 50|| length;
	this.vertices = new Tautology.Array();
	this.geom = new Tautology.MeshGeometry();
	this.pack = new THREE.Object3D();
	this.scene = scene;
}

Tautology.StraightStraw.prototype = {
	constructor : Tautology.StraightStraw,

	init : function (material) {
		this.vertices.init([new THREE.Vector3(0, 0, 0)]);
		this.vertices.dup(this.resolution+1);
		this.vertices.flatten();
		this.vertices.dup(2);

		this.geom.init(this.vertices, 0, 1, 0, 1);
		this.updateVertices();
		this.geom.generateGeom(true);


		this.pack.add(new THREE.Mesh(this.geom.geom, material['outside-mapped']));
		this.pack.add(new THREE.Mesh(this.geom.geom, material['inside-mapped']));
	},

	addModel : function(){
		this.scene.add(this.pack);
	},

	removeModel : function(){
		this.scene.remove(this.pack);
	},

	updateVertices : function(){
		_this = this;
		this.geom.geom.verticesNeedUpdate = true;

		this.vertices.applyFunc(function(){
			this.object.set(0, 0, 0);
			this.index.index[0] == 0 && this.object.add(new THREE.Vector3(_this.length/2, 0, 0));
			this.index.index[0] == 1 && this.object.add(new THREE.Vector3(-_this.length/2, 0, 0));
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