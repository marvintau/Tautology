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
	this.elems = (shape==undefined) ? [] : Array.permute(shape).map(
		function(index){return new Tautology.Element(
			new Tautology.Index(index),
			new constructor(),
			copyMethod);
		});

}

Tautology.Array.prototype.constructor = Tautology.Array;


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
	returnthis.elems.map(function(elem){return [elem.index.index+" "+elem.object]}).join("\n"));
};