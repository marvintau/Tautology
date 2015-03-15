// Most of the functions in this file is the modification or
// expansion of existing classes. Thus this file should be 
// loaded before all other Tautology subclasses.

// Some very handy Array/List manipulating functions which are
// very familiar in other popular FP languages. I LOVE FP.

/**
 * const generates a array with specific length and constant
 * object, which can be further modified. Since only the
 * reference of object is returned, this function should be
 * used only when generating the data with fundamental type.
 * 
 * @param  {Number} n    Length of the array to be generated
 * @param  {Object} func copy of new element
 * @return {Array}  constant array    
 */

Array.const = function(n, element){
    return Array.apply(null, new Array(n)).map(function(){
    	return element;
    });
}

/**
 * constDeep generates array with specific length with
 * new object copies, since the function above would only
 * copy the reference of objects.
 * @param  {[type]} n           [description]
 * @param  {[type]} Constructor [description]
 * @return {[type]}             [description]
 */
Array.constDeep = function(n, Constructor){
	return Array.apply(null, new Array(n)).map(function(){
		return new Constructor();
	});
}

/**
 * range generates a array with ascending integers from 0
 * @param  {Number} n the length of the array
 * @return {Array}  the array you want
 */
Array.range = function(n){
	return Object.keys(Array.const(n)).map(function(e){return parseInt(e)});
}

/**
 * Returns the (sort of) Cartesian Product of two matrix (this and another),
 * specify the operation over two element with func
 * @param  {Array} another Another matrix
 * @param  {Function} func    Operation to be applied
 * @return {Array}         The outer product of two array
 */
Array.prototype.outer = function(another, func){
	return this.map(function(outerElem){
		return another.map(function(innerElem){
			return func(outerElem, innerElem);
		})
	})
}


/**
 * Mesh generates an index array with hierarchical structure, that represents
 * a multi-dimensional matrix.
 * @param  {Array} shape Dimensions of Array
 * @return {Array}       to be generated
 */
Array.mesh = function(shape){
	var whole = Array.range(shape.reduce(function(a, b){return a*b}))
	return shape.reduce(function(prev, curr){
		return prev.partition(curr);
	}, whole)[0];
}

/**
 * grid generates the triangles that can directly applied to Three.js
 * @param  {Array} shape Dimensions of array
 * @return {Array}       to be generated
 */
Array.grid = function(shape){
	return Array.mesh(shape).slide(2)								// slide over cols
				.map(function(e){return e.transpose().slide(2)})	// slide over rows
				.flatten().map(function(e){return e.flatten()})		// flatten to get quads
				.map(function(e){return e.slide(3).tail()})
				.flatten().map(function(e){return e.toFace3()});
}

/**
 * Partitioning the array, with keeping the last part with not-enough items
 * to be partitioned.
 * @param  {Number} n number of items for each part
 * @return {Array}   Array to be returned
 */
Array.prototype.partition = function(n){
	return Array.range(Math.ceil(this.length/n)).map(function(e){return e*n})
				// starting point of each slice, slice including not-enough items will be kept also.
				.map(function(e){return this.slice(e, e+n)}, this)
}

/**
 * Flatten combines the parts of the array together
 * @return {Array} Flattened array
 */
Array.prototype.flatten = function(){
	return this.reduce(function(prev, curr){return prev.concat(curr)});
}

/**
 * Slide over an array with a window and combines windows together.
 * @param  {Number} n window-length
 * @return {Array}   Array of windows
 */
Array.prototype.slide = function(n){
	var res = [];
	for (var i = this.length - n; i >= 0; i--) {
		res.push(this.slice(i, i+n));
	};

	return res.reverse();
}

/**
 * Transpose a Matrix, a.k.a an array of arrays
 * @return {Array} Transposed array
 */
Array.prototype.transpose = function(){
	 return Object.keys(this[0]).map(
	    function (c) { return this.map(function (r) { return r[c]; }); }.bind(this)
    );
}


/**
 * make a 3-ary array into a THREE.Face3 object
 * @return {THREE.Face3} Face triangle
 */
Array.prototype.toFace3 = function(){
	if (this.length !=3){
		throw new Error('have to be length of 3');
	}
	return new THREE.Face3(this[0], this[1], this[2]);
}

/**
 * As name implies, change a two-entry array into another
 * array with one ordinary and one reversed. 
 * @return {Array} 
 */
Array.prototype.tail = function(){
	var x = this[1];
	x.push(x.shift());
	return [this[0], x.reverse()];
}

Array.prototype.last = function(){
	return this[this.length-1];
}

Array.prototype.accum = function() {
	//Accumulate from a new array [0] and then remove the first element.
	return this.reduce(function(a, b){return a.concat(a.last()+b)},[0]).slice(1);
};

Array.prototype.accumUpdate = function(){
	for (var i = 1; i < this.length; i++){
		this[i] += this[i-1];
	}
}

Array.prototype.constUpdate = function(n){
	for (var i = 0; i < this.length; i++){
		this[i] = n;
	}	
}

/**
 * Apply to monotone ascending numerical array
 * @return {[type]} [description]
 */
Array.prototype.normalize = function(){
	var first = this[0];
	var range = this[this.length-1] - this[0];

	for (var i = this.length - 1; i >= 0; i--) {
		this[i] = ( this[i] - this[0] ) / range;
	};
}

// Array.prototype.

/**
 * An instance method that returns a new array that combines
 * the reference of original object contained by the array,
 * and the index of the array. This new kind of array can be
 * used when you want to add/delete some elements while you
 * still need the existing array index.
 * @type {[type]}
 */

THREE.Vector3.prototype.roll = function(n, m){
	for (var i = 0; i < n; i++) {
		this.applyMatrix4(m);
	};
}

Object.values = function(obj){
	return Object.keys(obj).map(function(e){return obj[e]});
}