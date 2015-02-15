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
Tautology.Model = function(param, codes){
	this.param = param;
	this.codes = codes;

	this.array;
	this.geom;

	this.reversed = {};
}

Tautology.Model.prototype.constructor = Tautology.Model;

Tautology.Model.prototype.eval = function(){
	// 1. Generate the shape. First check whether the parameter list
	//    contains the shape function.
	if(!this.param.shape){
		throw new Error('Dimensions not mentioned.');
		return;
	} else if (this.param.shape.length != 2){
		throw new Error('The Tautology.Model only accepts 2-dimensional array.')
	}

	if(!this.param.cons){
		throw new Error('constructor not specified.');
		return;
	}
	
	this.array = Array.permute(this.param.shape).map(function(index){
			return { idx: index, 
					 vec: new THREE.Vector3(),
					 tex: new THREE.Vector2()};
		}.bind(this));

	this.array.forEach(function(elem, index){
		this.reversed[elem.index.toString()] = index;
	}.bind(this));

	
	// 2. Performs the operation specified in routines
	this.codes.forEach(function(code){
		this.array.forEach(function(elem){
			code.func.call(elem);
		}.bind(this))
	}.bind(this));
		
	// 4. create the geometry
	for(var i = 0; i < this.param.shape[0]-1; i++){
		for(var j = 0; j < this.param.shape[1]-1; j++){
			this.faces.push(new THREE.Face3(this.reversed[i+','+j],
											this.reversed[i+','+(j+1)],
											this.reversed[(i+1)+','+j]));
			this.faces.push(new THREE.Face3(this.reversed[i+','+(j+1)],
											this.reversed[(i+1)+','+j],
											this.reversed[(i+1)+','+(j+1)]));
		}
	};
}