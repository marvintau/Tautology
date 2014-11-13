Tautology.Array = function(){

	this.elems = [];
	this.shape = [];
	this.query = null;

	this.duplicate = function(elems, copyMethod, newDimension){

		var newElems = elems.slice();

		for(var i = 0; i< newElems.length; i++){
			newElems[i] = elems[i].clone(copyMethod);
			if(newDimension !== undefined){
				newElems[i].index = [newDimension].concat(newElems[i].index);
			}
		}

		return newElems;
	};

	this.permute = function(index, pattern){

		// rearranging the index according to the pattern. The pattern
		// is an array that each element denotes its original position
		// in the orignal array, which means the pattern should contain
		// all element in range(length(index))
		var temp = index.slice();
		var newIndex = [];
		for(var i = 0; i < index.length; i++){
			newIndex.push(temp[pattern[i]]);
		}
		return newIndex;
	};
}

Tautology.Array.prototype = {
	constructor : Tautology.Array,

	init : function(array, query){
		this.shape = [array.length];
		this.query = query;

		for(var i = 0; i < array.length; i++){
			this.elems.push(new Tautology.Element([i], array[i], this.query));
		}
	},

	dup : function(n, copy_method){
		var new_elems = this.duplicate(this.elems, copy_method);
		this.elems = [];
		for(var i = 0; i < n; i++){
			this.elems = this.elems.concat(this.duplicate(new_elems, copy_method, i));
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
	applyFunc : function(func, pattern){
		for(var i = 0; i < this.elems.length; i++){
			this.elems[i].applyFunc(func, pattern);
		}
	},

	output : function(){
		var _this = this;
		console.log(this.elems.map(function(elem){return [elem.index+" "+elem.object]}).join("\n"));
	}
}