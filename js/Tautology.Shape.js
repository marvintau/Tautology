Tautology.Shape = function(array){
	this.shape = array;
}

Tautology.Shape.prototype = {
	constructor : Tautology.Shape,

	prepend : function(n){
		this.shape.unshift(n);
	},

	flatten : function(){
		this.shape = [this.shape[0]*this.shape[1]].concat(this.shape.slice(2));
	},

	partition : function(){
		this.shape = [this.shape[0]/n, n].concat(this.shape.slice(1));
	},

	transpose : function(pattern){
		var newShape = [];
		for(var i = 0; i < this.shape.length; i++){
			newShape.push(this.shape[pattern[i]]);
		}
		this.shape = newShape;
	}
}