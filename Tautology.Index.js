// The index class should consist of method about manipulating index. Since
// the index represent multi-dimensional matrix, it should represents the way
// to initialize, manipulate, reduce or add more dimensions, and export to
// string to make it as key for quick look-up. Moreover, it can be mapped to
// a partial-order value for sorting.

// Remove all queries

/**
 * index
 * @param {Array} index
 * @constructor
 */
Tautology.Index = function(index){
	this.index = index;
}

Tautology.Index.prototype = {
	constructor : Tautology.Index,

	clone : function(){
		return new Tautology.Index(this.index.slice());
	},

	set : function(newIndex){
		this.index = newIndex;
	},

	prepend : function(newDimension){
		this.index.unshift(newDimension);
	},

	// For flattening
	flatten : function(dim){
		this.index = [this.index[0]*dim + this.index[1]].concat(this.index.slice(2));
	},

	// For partitioning
	partition : function(dim){
		this.index = [Math.floor(this.index[0]/dim), this.index[0] % dim].concat(this.index.slice(1));
	},
	
	transpose : function(pattern){
		var newIndex = [];
		for(var i = 0; i < this.index.length; i++){
			newIndex.push(this.index[pattern[i]]);
		}
		this.index = newIndex;
	},

	// For sorting
	sum : function(shape){
		// For sorting
		var sum = 0;
		for(var i = 0; i < this.index.length-1; i++){
			sum += this.index[i];
			sum *= shape.shape[i+1];
		}
		sum += this.index[this.index.length-1];
		return sum;
	},

	toLabel : function(){
		return this.index.toString();
	}

}