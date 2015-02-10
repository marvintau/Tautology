/**
 * Tautology.Model generates the THREE.Geometry model from
 * Tautology.Array object along with the updating function
 * that corresponds to the parameters associated with UI,
 * from given parameters, routines, and parts
 * 
 * @param {Object} param  An object with all properties are function which
 *                        returns the parameter value.
 * @param {Array}  dodes  The list of operations that will seuqentially
 *                        applied on the objects.
 * @param {Object} parts  An object with all functions that receives a Tau-
 *                        Index and returns true/false value use this to
 *                        define whether a point belongs to some particular
 *                        part.
 */
Tautology.Model = function(param, parts, codes){
	this.param = param;
	this.parts = parts;
	this.codes = codes;

	this.array;
	this.geom;
}

Tautology.Model.prototype.constructor = Tautology.Model;

Tautology.Model.prototype.eval = function(){
	// 1. Generate the shape. First check whether the parameter list
	//    contains the shape function.
	if(!this.param.shape){
		throw new Error('Dimensions not mentioned.');
		return;
	}

	if(!this.param.cons){
		throw new Error('constructor not specified.');
		return;
	}
	
	this.array = new Tautology.Array(this.param.shape(),this.param.cons());

	// 2. Performs the operation specified in routines
	for (var i = this.codes.length - 1; i >= 0; i--) {
		for (var j = this.array.elems.length - 1; j >= 0; j--) {
			// For each instruction, check each element if meets the part
			// criterion. Remember that the function in part uses `this`,
			// thus we need to use `call` to bind the `this` to the element.
			if (this.parts[this.codes[i].part].call(this.array.elems[j])){
				// and then apply the operation to the corresponding elems.
				this.codes[i].func.call(this.array.elems[j]);
			}
		};
	};

	// 3. compile queries for the updating function to be generated
	

	
	// remove objects that marked as deletion
	// perform the this.array.compileQuery(this.queries)
	
	// 4. create the geometry

	// 5. create the updating functions
}