Tautology.Region = function(ranges, shape){
	this.ranges = ranges.map(function(e, i){
		return new Tautology.Range(e, shape.shape[i]);
	});
	this.getTable(shape.shape);
}

Tautology.Region.prototype.constructor = Tautology.Region;

Tautology.Region.prototype.getTable = function(shape){
	var shape_reversed = shape.slice().reverse();
	this.table = this.ranges.reduce(function(perms, dim){
		return dim.range.outer(perms, function(d, perm){
			return perm.concat(d);
		}).flatten();
	},[[]]).map(function(label){
		return label.reverse().reduce(function(p, d, i){
			return p*shape_reversed[i]+d;
		});
	});
}