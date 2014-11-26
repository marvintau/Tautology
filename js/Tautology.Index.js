// The index class should consist of method about manipulating index. Since
// the index represent multi-dimensional matrix, it should represents the way
// to initialize, manipulate, reduce or add more dimensions, and export to
// string to make it as key for quick look-up. Moreover, it can be mapped to
// a partial-order value for sorting.

Tautology.Index = function(index, query){
	this.index = index;
	this.query = query;
}

Tautology.Index.prototype = {
	constructor : Tautology.Index,

	clone : function(){
		return new Tautology.Index(this.index.slice(), this.query);
	},

	set : function(newIndex){
		this.index = newIndex;
	},

	prepend : function(newDimension){
		this.index.unshift(newDimension);
	},

	// For flattening
	flatten : function(dim){
		this.index = [this.index[0]*dim + this.index[1]].concat(this.index.slice(2));
	},

	// For partitioning
	partition : function(dim){
		this.index = [Math.floor(this.index[0]/dim), this.index[0] % dim].concat(this.index.slice(1));
	},
	
	transpose : function(pattern){
		var newIndex = [];
		for(var i = 0; i < this.index.length; i++){
			newIndex.push(this.index[pattern[i]]);
		}
		this.index = newIndex;
	},

	// For sorting
	sum : function(shape){
		// For sorting
		var sum = 0;
		for(var i = 0; i < this.index.length-1; i++){
			sum += this.index[i];
			sum *= shape.shape[i+1];
		}
		sum += this.index[this.index.length-1];
		return sum;
	},

	match : function(queryArray){
		var matchSingleDimension = function(indexSingle, querySingle){

			with({table : this.query.queryTable}){
				for(var i = 0; i < table.length; i++){
					if(table[i].cond(querySingle) && table[i].check(indexSingle, querySingle)){
						return true;
					}
				}
				return false;
			}
		}.bind(this);

		var outcome = true;
		if(queryArray != undefined && this.index.length == queryArray.length){
			for(var i = 0; i < this.index.length; i++){
				outcome = outcome && matchSingleDimension(this.index[i], queryArray[i]);
			}
		}
		return outcome;
	},

	toLabel : function(){
		return this.index.toString();
	}

}