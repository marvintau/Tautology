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

	/**
	 * make a new copy of the index (only called by
	 * copying an element that contains this index)
	 * @return {[type]} [description]
	 */
	clone : function(){
		return new Tautology.Index(this.index.slice());
	},

	/**
	 * Set the new index with an array
	 * @param {Array} newIndex [description]
	 */
	set : function(newIndex){
		this.index = newIndex;
		return null;
	},

	/**
	 * prepend a new dimension (use when padding
	 * the matrix)
	 * @param  {[type]} newDimension [description]
	 * @return {[type]}              [description]
	 */
	prepend : function(newDimension){
		this.index.unshift(newDimension);
		return null;
	},

	/**
	 * Flattens the outermost dimension of the array
	 * @param  {[type]} dim [description]
	 * @return {[type]}     [description]
	 */
	flatten : function(dim){
		this.index = [this.index[0]*dim + this.index[1]].concat(this.index.slice(2));
		return null;
	},

	/**
	 * partition the outermost dimensions, while the
	 * remainders will be discarded.
	 * @param  {[type]} dim [description]
	 * @return {[type]}     [description]
	 */
	partition : function(dim){
		this.index = [Math.floor(this.index[0]/dim), this.index[0] % dim].concat(this.index.slice(1));
		return null;
	},
	
	/**
	 * permutes the index, which causes the transposing
	 * effect over the whole matri
	 * @param  {[type]} pattern [description]
	 * @return {[type]}         [description]
	 */
	transpose : function(pattern){
		var newIndex = [];
		for(var i = 0; i < this.index.length; i++){
			newIndex.push(this.index[pattern[i]]);
		}
		this.index = newIndex;
		return null;
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
	}
}