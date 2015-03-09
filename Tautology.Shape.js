Tautology.Shape = function(shape){
	this.shape = shape;
	this.getLabels();
}

Tautology.Shape.prototype.constructor = Tautology.Shape;

Tautology.Shape.prototype.getLabels = function(){
	this.labels = this.shape.reduce(function(perms, dim){
		return Array.range(dim).outer(perms, function(d, perm){
			return perm.concat(d);
		}).flatten();
	},[[]]);

}