// Only executed one time, when initiating an AwesomePointSet
// (needed to change name) instance. 
Matcher = function(pattern){
	this.patt = pattern;
	this.funcs = [];
	this.matcher = null;
}

Matcher.prototype = {
	constructor : Matcher,
	register : function(type_func, res_func){
		this.funcs
	}
}

AwesomeElem = function(index, object){
	this.index  = index;
	this.object = object;
}

AwesomeElem.prototype = {
	constructor : AwesomeElem,

	clone : function(copy_method){
		// we don't know if it's called "clone" or "copy" or whatever, just leave it
		// to the real user.
		this.object.constructor.prototype.copy_method = copy_method;
		var new_obj_clone = this.object.copy_method();
		delete this.object.constructor.prototype.copy_method;
		return new AwesomeElem(this.index.slice(), new_obj_clone);
	},

	apply_func : function(func, patt){
		// here the function passed as parameter will be added to the prototype of AwesomeElem,
		// since the index might be useful for the operation. 
		this.constructor.prototype.operator = func;

		// Matching the index with pattern. the "d" in the pattern means "don't care" item.
		var outcome = true;
		if(patt !== undefined){
			for(var i = 0; i < patt.length; i++){
				outcome = outcome && (patt[i]==="d") ? true : ((patt[i].length===2) ? (this.index[i] >=patt[i][0] && this.index[i] <patt[i][1]) : (this.index[i]===patt[i]));
			}
		}

		// If outcome is true means all matched.
		if(outcome){
			this.operator();
		}
		delete this.constructor.prototype.operator;
	},

	set_index : function(new_index){
		this.index = new_index;
	},

	flatten : function(dim){
		this.index = [this.index[0]*dim + this.index[1]].concat(this.index.slice(2));
	},

	part_index : function(dim){
		this.index = [Math.floor(this.index[0]/dim), this.index[0] % dim].concat(this.index.slice(1));
	},

	sum_index : function(shape){
		var sum = 0;
		for(var i = 0; i < this.index.length-1; i++){
			sum = (sum + this.index[i]) * shape[i+1];
		}
		sum = sum + this.index[this.index.length-1];
		return sum;
	},

}

AwesomeArray = function(){

	this.type = "AwesomeArray";

	this.elems = [];
	this.shape = [];

	this.dup_elems = function(elems, copy_method){

		// create a deepcopy of the array of object references.
		var new_elems = elems.slice();

		// create deepcopy for all object refered in the array.
		for(var i = 0; i< new_elems.length; i++){
			new_elems[i] = elems[i].clone(copy_method);
		}

		// then a deepcopy of the elems is formed.
		return new_elems;
	};

	this.dup_new_dimension = function(elems, value, copy_method){

		// get a new copy of object array
		var new_elems = this.dup_elems(elems, copy_method);

		// add new dimension for each entry,  which conceptually forms
		// a matrix of objects (or matrix of submatrices of objects)
		for(var i = 0; i<new_elems.length; i++){
			new_elems[i].index = [value].concat(new_elems[i].index);
		}

		return new_elems;
	};

	this.permute = function(index, pattern){

		// rearranging the index according to the pattern. The pattern
		// is an array that each element denotes its original position
		// in the orignal array.
		var temp = index.slice();
		var new_index = [];
		for(var i = 0; i < index.length; i++){
			new_index.push(temp[pattern[i]]);
		}
		return new_index;
	};
}

AwesomeArray.prototype = {
	constructor : AwesomeArray,

	init : function(array){
		for(var i = 0; i < array.length; i++){
			this.elems.push(new AwesomeElem([i], array[i]))			
		}
		this.shape = [array.length];
	},

	dup : function(n, copy_method){
		var new_elems = this.dup_elems(this.elems, copy_method);
		this.elems = [];
		for(var i = 0; i < n; i++){
			this.elems = this.elems.concat(this.dup_new_dimension(new_elems, i, copy_method));
		}
		this.shape = [n].concat(this.shape);
	},

	flatten : function(){
		for(var i = 0; i < this.elems.length; i++){
			this.elems[i].flatten(this.shape[1]);
		}
		this.shape = [this.shape[0]*this.shape[1]].concat(this.shape.slice(2));
	},

	partition : function(n){
		var removed_modulo = this.elems.length - this.elems.length % n;
		this.elems = this.elems.slice(0, removed_modulo);
		for(var i = 0; i < this.elems.length; i++){
			this.elems[i].part_index(n);
		}
		this.shape = [this.shape[0]/n, n].concat(this.shape.slice(1));

	},
	transpose : function(patt){
		var _this = this;
		for(var i = 0; i < this.elems.length; i++){
			this.elems[i].index = this.permute(this.elems[i].index,patt);
		}
		this.shape = this.permute(this.shape, patt);
		this.elems.sort(function(a, b){

			return a.sum_index(_this.shape) - b.sum_index(_this.shape);
		});

		
	},
	apply_func : function(pattern, func){
		
		for(var i = 0; i < this.elems.length; i++){
			this.elems[i].apply_func(pattern, func);
		}
	},

	output : function(){
		var _this = this;
		return this.elems.map(function(elem){return [elem.index]}).join("\n");
	}
}