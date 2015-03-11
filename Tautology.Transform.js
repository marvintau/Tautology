Tautology.Transform = function(geom, transSpec){
	this.param = geom.param;
	this.shape = geom.shape.shape;
	this.labels = geom.shape.labels;
	this.vertices = geom.shape.vertices;
	this.indices = geom.regions[transSpec.region].table;

	this[transSpec.command](transSpec.callback, transSpec.dimension);
};

Tautology.Transform.prototype.constructor = Tautology.Transform;

Tautology.Transform.prototype.tran = function(settingCallback){

	this.v = new THREE.Vector3();
	this.settingCallback = settingCallback;

	this.update = function(){
		this.indices.forEach(function(i){
			this.settingCallback.call(this);
			this.vertices[i].add(this.v);
		}.bind(this));
	}
};

Tautology.Transform.prototype.radiate = function(settingCallback,dimension){
	this.v = new THREE.Vector3();
	this.axis = new THREE.Vector3();
	this.dim = dimension;
	this.settingCallback = settingCallback;

	this.update = function(){
		this.settingCallback.call(this);

		var l = this.labels,
			s = this.shape,
			d = this.dim;

		this.indices.forEach(function(i){
			this.vertices[i].add(this.v);
			this.vertices[i].applyAxisAngle(this.axis, 2*Math.PI*l[i][d]/(s[d]-1));
		}.bind(this));
	}
};

Tautology.Transform.prototype.bend = function(settingCallback,dimension){
	this.bendAxis = new THREE.Vector3();
	this.feed = new THREE.Vector3();
	this.matrices = Array.constDeep(this.shape[dimension], THREE.Matrix4);
	this.settingCallback = settingCallback;
	this.dim = dimension;

	this.update = function () {
		this.settingCallback.call(this);
		var l = this.labels,
			d = this.dim;

		for(var i = 1; i < this.matrices.length; i++){
			this.matrices[i].multiplyMatrices(this.matrices[i-1], this.matrices[0]);
		};

		this.indices.forEach(function(i){
			this.vertices[i].applyMatrix4(this.matrices[l[i][d]]);
		}.bind(this));

	}
}