/**
 * Tautological Array organizes the Elements. The Array needs to maintain and
 * manipulate the structure of the matrix, and apply operations over specific
 * Elements.
 * @constructor
 */
Tautology.Array = function(shape, constructor){

	/**
	 * Array shape (dimension)
	 * @private
	 * @type {[type]}
	 */
	this.shape = (shape==undefined) ? [] : shape;
	this.cons = constructor;
	/**
	 * element array
	 * @private
	 * @type {Array}
	 */
	this.elems = (shape==undefined) ? [] : Array.permute(shape).map(
		function(index){
			return { index: index, object: new this.cons()};
		}.bind(this));
	
	this.compiledQueries = {};
}

Tautology.Array.prototype.constructor = Tautology.Array;

/**
 * compileQuery finds the indices in the array that meets the query
 * rule, and find the corresponding index of native array. 
 * @param  {[type]} queryRules [description]
 * @return {[type]}            [description]
 */
Tautology.Array.prototype.compileQuery = function(queryRules) {
	this.elems = this.elems.filter(function(elem){
		return !elem.mad;
	})

	for (var i = this.elems.length - 1; i >= 0; i--) {
		for(var query in queryRules){
			if(queryRules[query](this.elems[i].index)){
				(!this[query]) && (this[query]=[]);
				this.compiledQueries.query.push[this.elems[i]];
			}
		}
	};
};