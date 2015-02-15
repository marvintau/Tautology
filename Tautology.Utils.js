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
	return Object.keys(Array.const(n)).map(function(e){return parseInt(e)});
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

Array.less = function(arr1, arr2){
	if(arr1.length!= arr2.length){
		throw new Error('inequal length');
		return;
	}
	var res = true;
	for (var i = 0; i < arr1.length; i++) {
		(arr1[i] > arr2[i]) && res 
	};
}

/**
 * An instance method that returns a new array that combines
 * the reference of original object contained by the array,
 * and the index of the array. This new kind of array can be
 * used when you want to add/delete some elements while you
 * still need the existing array index.
 * @type {[type]}
 */

Array.prototype.add = function(arr){
	for (var i = 0; i < this.length; i++) {
		this[i] += arr[i];
	};
	return null;
}

Array.prototype.zipWith = function(holder){
	var isSameLength = function(holder, length){
		return Object.keys(holder)
					 .map(function(key){return holder[key].length==length})
			  		 .every(function(elem){return elem});
	}

	if(!holder){
		return this.map(function(elem, index){
			return {'index': index, 'object':elem};
		});
	} else if(!isSameLength(holder, this.length)){
		throw new Error('zipWith needs arrays with same length');
		return;
	} else {
		return this.map(function(elem, index){
			var new_elem = {};
			Object.keys(holder).forEach(function(key){
				new_elem[key] = holder[key][index];
			})

			return new_elem;
		})
	}
}

Array.prototype.selectBy = function(func){
	return this.filter(function(elem){
		return func.call(elem.object);
	});
}

Array.prototype.unzipFor = function(property){
	return this.map(function(elem){return elem[property]});
}

Object.values = function(obj){
	return (Object.keys(obj)).map(function(key){return obj[key]});
}