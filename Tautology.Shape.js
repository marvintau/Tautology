Tautology.Shape = function(shape){
	this.shape = shape;
	this.getLabels();
	this.makeVertices();
}

Tautology.Shape.prototype.constructor = Tautology.Shape;

Tautology.Shape.prototype.getLabels = function(){
	this.labels = this.shape.reduce(function(perms, dim){
		return Array.range(dim).outer(perms, function(d, perm){
			return perm.concat(d);
		}).flatten();
	},[[]]);
}

Tautology.Shape.prototype.makeVertices = function(){
	this.vertices = this.labels.map(function(e){return new THREE.Vector3()});
}