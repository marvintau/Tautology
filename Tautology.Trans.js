Tautology.Trans = function(param, vertices, regionLabel){
	this.param = param;
	this.vertices = vertices;
	this.indices = this.param.regions.compiled[regionLabel];
};

Tautology.Trans.prototype.constructor = Tautology.Trans;

Tautology.Trans.prototype.tran = function(settingCallback){

	this.v = new THREE.Vector3();
	this.settingCallback = settingCallback;

	this.update = function(){
		this.settingCallback.call(this);
		this.indices.forEach(function(i){
			this.vertices[i].add(this.v);
		}.bind(this));
		// console.log(this.vertices);
	}
};

Tautology.Trans.prototype.radiate = function(settingCallback,dimension){
	this.v = new THREE.Vector3();
	this.axis = new THREE.Vector3();
	this.dim = dimension;
	this.settingCallback = settingCallback;

	this.update = function(){
		this.settingCallback.call(this);

		var a = this.param.array,
			s = this.param.shape;
			d = this.dim;

		this.indices.forEach(function(i){
			this.vertices[i].add(this.v);
			this.vertices[i].applyAxisAngle(this.axis, 2*Math.PI*a[i][d]/(s[d]-1));
		}.bind(this));
	}
	console.log(this.vertices);
}

Tautology.Trans.prototype.bend = function(settingCallback,dimension){
	this.bendAxis = new THREE.Vector3();
	this.feed = new THREE.Vector3();
	this.matrices = Array.constDeep(param.shape[dimension], THREE.Matrix4);
	this.settingCallback = settingCallback;
	this.dim = dimension;

	this.update = function () {
		this.settingCallback.call(this);
		var a = this.param.array,
			d = this.dim;

		for(var i = 1; i < this.matrices.length; i++){
			this.matrices[i].multiplyMatrices(this.matrices[i-1], this.matrices[0]);
		};

		this.indices.forEach(function(i){
			this.vertices[i].applyMatrix4(this.matrices[a[i][d]]);
		}.bind(this));

	}
}