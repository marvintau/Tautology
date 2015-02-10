Tautology.Model = function(parameters, routines, queries){
	this.parameters = parameters;
	this.routines = routines;
	this.queries = queries;

	this.array;
	this.geom;
}

Tautology.Model.prototype.constructor = Tautology.Model;

Tautology.Model.prototype.eval = function(){
	// 1. Generate the shape;
	if(!this.parameters.shape){
		throw new Error('But you have to specify the dimensions of the matrix in the parameter list..');
		return;
	}
	this.array = new Tautology.Array(this.parameters.shape());

	// 2. Performs the operation specified in routines
	for (var i = this.routines.length - 1; i >= 0; i--) {
		for (var j = this.array.elems.length - 1; i >= 0; i--) {
			if (this.queries[this.routines[i].query](this.array.elems[j])){
				this.array.elems[j].(this.routines[i].func(this.routines[i].))
			}
		};
	};

	// 3. compile queries for the updating function to be generated!
	// remove objects that marked as deletion
	// perform the this.array.compileQuery(this.queries)
	
	// 4. create the geometry

	// 5. create the updating functions
}