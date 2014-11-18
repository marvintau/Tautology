Tautology.Element = function(index, object, query){
	this.index  = index;
	this.object = object;
	this.query  = query;
}

Tautology.Element.prototype = {
	constructor : Tautology.Element,

	clone : function(copyMethod){
		with ({proto : this.object.constructor.prototype}){
			proto.copyMethod = copyMethod;
			var newClone = this.object.copyMethod();
			delete proto.copy_method;			
		};
		return new Tautology.Element(this.index.slice(), newClone, this.query);	
	},

	applyFunc : function(func, queryArray){
		// here the function passed as parameter will be added to the prototype of AwesomeElem,
		// since the index might be useful for the operation. 
		with ({proto : this.constructor.prototype}){
			proto.operator = func;

			// If outcome is true means all matched.
			if(this.query.match(this.index, queryArray)){
				this.operator();
			}
			delete proto.operator;
		}
	},

	setIndex : function(newIndex){
		this.index = newIndex;
	},

	flatten : function(dim){
		// if(this.index.length > 1){
			this.index = [this.index[0]*dim + this.index[1]].concat(this.index.slice(2));	
		// }
	},

	reshapeIndex : function(dim){
		this.index = [Math.floor(this.index[0]/dim), this.index[0] % dim].concat(this.index.slice(1));
	},

	sumIndex : function(shape){
		var sum = 0;
		for(var i = 0; i < this.index.length-1; i++){
			sum = (sum + this.index[i]) * shape[i+1];
		}
		sum = sum + this.index[this.index.length-1];
		return sum;
	},

}
