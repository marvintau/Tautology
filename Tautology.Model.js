/**
 * Tautology.Model generates the THREE.Geometry model from
 * Tautology.Array object along with the updating function
 * that corresponds to the parameters associated with UI,
 * from given params, routines, and queries
 * 
 * @param {Object} params An object with all properties are function which
 *                            returns the parameter value.
 * @param {Array}  routines   The list of operations that will seuqentially
 *                            applied on the objects.
 * @param {Object} queries    An object with all functions that receives a Tau-
 *                            Index and returns true/false value.
 */
Tautology.Model = function(params, routines, queries){
	this.params = params;
	this.routines = routines;
	this.queries = queries;

	this.array;
	this.geom;
}

Tautology.Model.prototype.constructor = Tautology.Model;

Tautology.Model.prototype.eval = function(){
	// 1. Generate the shape. First check whether the parameter list
	//    contains the shape function.
	if(!this.params.shape){
		throw new Error('Dimensions not mentioned.');
		return;
	}

	if(!this.params.cons){
		throw new Error('constructor not specified.');
		return;
	}
	
	this.array = new Tautology.Array(this.params.shape(),this.params.cons());

	// 2. Performs the operation specified in routines
	for (var i = this.routines.length - 1; i >= 0; i--) {
		for (var j = this.array.elems.length - 1; j >= 0; j--) {
			// console.log(this.queries[this.routines[i].query].call(this.array.elems[j]));
			if (this.queries[this.routines[i].query].call(this.array.elems[j])){
				console.log(this.array.elems[j].index);
				// this.array.elems[j].(this.routines[i].func(this.routines[i].))
			}
		};
	};

	// 3. compile queries for the updating function to be generated!
	// remove objects that marked as deletion
	// perform the this.array.compileQuery(this.queries)
	
	// 4. create the geometry

	// 5. create the updating functions
}