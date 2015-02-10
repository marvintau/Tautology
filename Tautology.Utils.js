// Most of the functions in this file is the modification or
// expansion of existing classes. Thus this file should be 
// loaded before all other Tautology subclasses.

// Some very handy Array/List manipulating functions which are
// very familiar in other popular FP languages. I LOVE FP.

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
	var a = Array.const(n, null);
	for (var key in a) {
		a[key] = parseInt(key);
	};
	return a;
}

/**
 * permute generates an array of arrays that represents a
 * multi-dimensional matrix of permuations with given shape.
 * 
 * @param  {[type]} shape [description]
 * @return {[type]}       [description]
 */
Array.permute = function(shape){
	// for each dimension
	return shape.reduce(function(perms, dimension){
		// for each number in the range of new dimension
		return Array.range(dimension).map(function(elem){
			// for each permutation of existing dimensions
			return perms.map(function(perm){
				// combine each new number with each of the existing perms
				return perm.concat(elem);
			});
		// for each newly formed perm (is a two-dimensional array)
		}).reduce(function(a, b){
			// flatten 
			return a.concat(b);
		});
	}, [[]]).map(function(elem){
		// reverse each permutation
		return elem.reverse();
	});
}
