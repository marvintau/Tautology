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
Tautology.Array.prototype.compileQuery = function(rules) {
	// If the "Marked as deletion" is false or undefined
	// the element will be preserved.
	this.elems = this.elems.filter(function(elem){
		return !elem.mad;
	})

	for(var query in rules){
		this[query] = this.elems.map(function(elem, index){return {i:index, e:elem};})
				  .filter(function(elem){ return rules[query].call(elem.e);})
				  .map(function(elem){return elem.i});
	}
};