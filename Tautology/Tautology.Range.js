Tautology.Range = function(range, length){
	this.range = range;
	this.set(this.range, length);
}

Tautology.Range.prototype.constructor = Tautology.Range;

Tautology.Range.prototype.set = function(range, length){
	this.range = range;
	if(!isNaN(this.range)){
		this.range = this.single(length);
	} else if (Array.isArray(range)){
		this.range = this.interval(length);
	} else if (this.range == 'all'){
		this.range = this.all(length);
	}
}

Tautology.Range.prototype.neg = function(i, length){
	return (i >= 0) ? i : (length + i);
}

Tautology.Range.prototype.all = function(length){
	return Array.range(length);
};

Tautology.Range.prototype.single = function(length){
	return [this.neg(this.range, length)];
}

Tautology.Range.prototype.interval = function(length){
	var start = this.neg(this.range[0], length),
		end = this.neg(this.range[1], length),
		step = this.range[2] ? this.range[2] : 1;
	return Array.range(~~(end - start + 1)/step)
				.map(function(e){return e*step + start});
}