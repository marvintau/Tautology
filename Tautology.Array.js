/**
 * Tautological Array organizes the Elements. The Array needs to maintain and
 * manipulate the structure of the matrix, and apply operations over specific
 * Elements.
 * @constructor
 */
Tautology.Array = function(shape, constructor, copyMethod){

	/**
	 * Array shape (dimension)
	 * @private
	 * @type {[type]}
	 */
	this.shape = (shape==undefined) ? [] : shape;


	/**
	 * element array
	 * @private
	 * @type {Array}
	 */
	this.elems = (shape==undefined) ? [] : function(){
		Array.permute(shape).map(function(index){
			new Tautology.Element(
				new Tautology.Index(index),
				new constructor(),
				copyMethod);
		})
	};

}

Tautology.Array.prototype.constructor = Tautology.Array;

/**
 * Initialize the array in the Tautology array with given array and query.
 * By pushing the elements into the array, an 1-dimensional index is also
 * assigned.
 * @param {Array} array array to be transformed
 */
Tautology.Array.prototype.init = function(array){
	this.shape = new Tautology.Shape([array.length]);

	for(var i = 0; i < array.length; i++){
		this.elems.push(new Tautology.Element(new Tautology.Index([i]), array[i]));
	}
};

/**
 * Initialize the array in the Tautology array with given array and query.
 * By pushing the elements into the array, an 1-dimensional index is also
 * assigned.
 * @param  {Number} n times to duplicate
 * @param  {Function} copy_method method name to clone memory
 */
Tautology.Array.prototype.dup = function(n, copy_method){
	(copy_method == undefined) && (copy_method = THREE.Vector3.prototype.clone);
	var new_elems = this.deepcopy(this.elems, copy_method);
	this.elems = [];
	for(var i = 0; i < n; i++){
		this.elems = this.elems.concat(this.deepcopy(new_elems, copy_method, i));
	}
	this.shape.prepend(n);
};

/**
 * Remove ith vector from particular dimension
 * @param  {Number} dimension
 * @param  {Number} ith
 */
Tautology.Array.prototype.remove = function(dimension, ith){
	(ith == -1) && (ith = this.shape.shape[dimension] - 1);
	console.log(ith);
	for (var i = 0; i < this.elems.length; i++){
		if (this.elems[i].index.index[dimension] == ith) {
			console.log(this.elems[i].index.index);
			delete this.elems[i];
			continue;
		}
		(this.elems[i].index.index[dimension] > ith) && (this.elems[i].index.index[dimension] --);
	}

	this.elems.sort(function(a, b){
		return a.index.sum(this.shape) - b.index.sum(this.shape);
	}.bind(this));

	// console.log(this.elems);
	this.elems.length = this.elems.length - this.elems.length / this.shape.shape[dimension];
	this.shape.shape[dimension] --;
	console.log(this.elems.length);
};

/**
 * Flatten reduces the number dimension of array from the outermost level
 */
Tautology.Array.prototype.flatten = function(){
	for(var i = 0; i < this.elems.length; i++){
		this.elems[i].index.flatten(this.shape.shape[1]);
	}
	this.shape.flatten();
};
/**
 * split the element into sub matrix with equal dimension, with remainder omitted
 * @param  {Number} n
 * @param  {Function} disposeMethod
 */
Tautology.Array.prototype.partition = function(n, disposeMethod){
	var most = this.elems.length - this.elems.length % n;

	if(disposeMethod != undefined){
		for(var i = most; i < this.elems.length; i++){
			this.elems[i].disposeMethod();
		}	
	}

	this.elems.length = most;

	for(var i = 0; i < this.elems.length; i++){
		this.elems[i].index.partition(n);
	}
	this.shape.partition();

};

/**
 * Transpose swaps the dimensions according to the pattern specified by patt
 * @param  {Array} patt
 */
Tautology.Array.prototype.transpose = function(patt){
	var _this = this;
	for(var i = 0; i < this.elems.length; i++){
		this.elems[i].index.transpose(patt);
	}
	this.shape.transpose(patt);

	this.elems.sort(function(a, b){
		return a.index.sum(_this.shape) - b.index.sum(_this.shape);
	});
};

/**
 * Apply operation over specific elements
 * @param  {Function} func the operation
 * @param  {Array} the pattern
 */
Tautology.Array.prototype.applyFunc = function(func){
	for(var i = 0; i < this.elems.length; i++){
		this.elems[i].applyFunc(func);
	}
};

/**
 * Output for debug purpose
 * @return {[type]} [description]
 */
Tautology.Array.prototype.output = function(){
	var _this = this;
	console.log(this.elems.map(function(elem){return [elem.index.index+" "+elem.object]}).join("\n"));
};