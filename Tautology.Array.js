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

	this.reversed = {};
	this.elems.forEach(function(elem, index){
		this.reversed[elem.index.toString()] = index;
	}.bind(this));

	this.faces = [];
}

Tautology.Array.prototype.constructor = Tautology.Array;

/**
 * compileQuery finds the indices in the array that meets the query
 * rule, and find the corresponding index of native array. 
 * @param  {[type]} queryRules [description]
 * @return {[type]}            [description]
 */

Tautology.Array.prototype.makeFaces = function(){
	for(var i = 0; i < this.shape[0]-1; i++){
		for(var j = 0; j < this.shape[1]-1; j++){
			this.faces.push(new THREE.Face3(this.reversed[i+','+j],
											this.reversed[i+','+(j+1)],
											this.reversed[(i+1)+','+j]));
			this.faces.push(new THREE.Face3(this.reversed[i+','+(j+1)],
											this.reversed[(i+1)+','+j],
											this.reversed[(i+1)+','+(j+1)]));
		}
	}
}

Tautology.Array.prototype.apply = function(codes){
	codes.forEach(function(code){
		this.elems.forEach(function(elem){
			code.func.call(elem);
		}.bind(this))
	}.bind(this));
}

Tautology.Array.prototype.assemble = function(geom){
	geom.vertices = this.elems.unzipFor('object').unzipFor('vec');
	// geom.faces = this.
}