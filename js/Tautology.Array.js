// Tautological Array organizes the Elements. The Array needs to maintain and
// manipulate the structure of the matrix, and apply operations over specific
// Elements.

Tautology.Array = function(){

	this.elems = [];
	this.shape = null;
	this.query = null;

	this.deepcopy = function(elems, copyMethod, newDimension){
		
		var newElems = elems.slice();

		for(var i = 0; i< newElems.length; i++){
			newElems[i] = elems[i].clone(copyMethod);
			(newDimension !== undefined) && newElems[i].index.prepend(newDimension);
		}

		return newElems;
	};
}

Tautology.Array.prototype = {
	constructor : Tautology.Array,

	// Initialize the array in the Tautology array with given array and query.
	// By pushing the elements into the array, an 1-dimensional index is also
	// assigned.
	init : function(array, query){
		this.shape = new Tautology.Shape([array.length]);
		this.query = query;

		for(var i = 0; i < array.length; i++){
			this.elems.push(new Tautology.Element(new Tautology.Index([i], this.query), array[i]));
		}
	},

	// Duplicate the current whole elements. Meanwhile extends 1 dimension from
	// original list (matrix). 
	dup : function(n, copy_method){
		var new_elems = this.deepcopy(this.elems, copy_method);
		this.elems = [];
		for(var i = 0; i < n; i++){
			this.elems = this.elems.concat(this.deepcopy(new_elems, copy_method, i));
		}
		this.shape.prepend(n);
	},

	// Concatenate two Tautological Array together, (so no need to implement
	// the prepending/appending submatrix separately.) The submatrix should
	// have different length on only one dimension.

	// Concatenation changes the shape of matrix, splice the array with objects,
	// so no need to specify the method about object disposal.
	concatenate : function(array){

		// i represents the ith dimension that two matrices differ. if the two
		// matrices are structurally identical, then i will be set back to 0,
		// to join the matrices at the highest level.

		var i = 0;
		for(; i <= this.shape.length; i++){
			if(i == this.shape.length){
				i = 0;
				break;
			}
			if(this.shape[i] != array.shape[i]) break;
		}

		// increase the index on that dimension
		for(var n = 0; n < array.elems.length; n++){
			array.elems.index.index[i] += this.shape[i];
		}

		this.elems.concat(array.elems);

		delete array;
	},

	flatten : function(){
		for(var i = 0; i < this.elems.length; i++){
			this.elems[i].index.flatten(this.shape.shape[1]);
		}
		this.shape.flatten();
	},

	partition : function(n, disposeMethod){

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

	},
	transpose : function(patt){
		var _this = this;
		for(var i = 0; i < this.elems.length; i++){
			this.elems[i].index.transpose(patt);
		}
		this.shape.transpose(patt);

		this.elems.sort(function(a, b){
			return a.index.sum(_this.shape) - b.index.sum(_this.shape);
		});
		
	},
	apply : function(func, pattern){
		for(var i = 0; i < this.elems.length; i++){
			this.elems[i].apply(func, pattern);
		}
	},

	output : function(){
		var _this = this;
		console.log(this.elems.map(function(elem){return [elem.index.index+" "+elem.object]}).join("\n"));
	}
}