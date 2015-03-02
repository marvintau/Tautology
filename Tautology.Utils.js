// Most of the functions in this file is the modification or
// expansion of existing classes. Thus this file should be 
// loaded before all other Tautology subclasses.

// Some very handy Array/List manipulating functions which are
// very familiar in other popular FP languages. I LOVE FP.

function sq(x){
	return x*x;
}

function bezier(a, b, c, d, t){
	var trsq = sq( 1 - t ),
		tsq = sq( t );
	return a * trsq * ( 1 - t ) +
		   b * 3 * trsq *t +
		   c * 3 * tsq * ( 1 - t ) +
		   d * tsq * t 
}

/**
 * const generates a array with specific length
 * and constant object, which can be further 
 * modified.
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
 * Permute generates the sparse-array-like indices with given
 * dimensions (a.k.a. shape).
 * @param  {Array} shape Given dimensions
 * @return {Array}       Array of indices
 */
Array.permute = function(shape){
	return shape.reduce(function(perms, dim){
		return Array.range(dim).outer(perms, function(d, perm){
			return perm.concat(d);
		}).flatten().reverse();
	},[[]])
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

Array.prototype.checkRegionIndex = function(shape, regionSpec, dimConditions){
	return this.every(function(dim, i){
		return dimConditions.some(function(crit){
			return crit.typeCond(regionSpec[i]) && crit.cond(dim, regionSpec[i], shape[i]);
		})
	});
}

Array.prototype.findRegionIndex = function(shape, regionSpec){

	var r = function(i, r){
		return (i > 0) ? (i - 1) : (r + i);
	}

	var dimConditions = [
		{
			typeCond : function(ithSpec){ return !ithSpec },
			cond : function(){return 1;}
		},
		{
			typeCond : function(ithSpec){ return ithSpec && ithSpec.start },
			cond : function(dim, ithSpec, ithShape){
				var isInInterval = dim >= r(ithSpec.start, ithShape) && dim <= r(ithSpec.end, ithShape);
				return isInInterval && ((dim + (ithSpec.shift ? ithSpec.shift : 0)) % (ithSpec.every ? ithSpec.every : 1) == 0 );
			}
		},
		{
			typeCond : function(ithSpec){ return ithSpec && ithSpec.slice },
			cond : function(dim, ithSpec, ithShape){
				return dim == r(ithSpec.slice, ithShape);
			}
		}
	];

	return this.map(function(tauIndex, index){ return {tau: tauIndex, i: index}; })
			   .filter(function(elem){ return elem.tau.checkRegionIndex(shape, regionSpec, dimConditions); })
			   .map(function(e){return e.i});
}

/**
 * make a 3-ary array into a THREE.Face3 object
 * @return {THREE.Face3} Face triangle
 */
Array.prototype.toFace3 = function(){
	if (this.length !=3){
		throw new Error('have to be length of 3');
		return
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

Object.findIndex = function(obj, prop){
	return 
}