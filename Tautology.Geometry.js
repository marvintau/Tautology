/**
 * Tautology.Geometry generates the THREE.Geometry model from
 * Tautology.Array object along with the updating function
 * that corresponds to the parameters associated with UI,
 * from given parameters, routines, and parts
 * 
 * @param {Object} param  An object with all properties are function which
 *                        returns the parameter value.
 * @param {Array}  codes  The list of operations that will seuqentially
 *                        applied on the objects.
 */
Tautology.Geometry = function(param, code){
	this.param = param;
	this.code = code;

	this.array;

	this.make();
}

Tautology.Geometry.prototype.constructor = Tautology.Geometry;

Tautology.Geometry.prototype.make = function(){
	// 1. Generate the shape. First check whether the parameter list
	//    contains the shape function.
	if(!this.param.shape){
		throw new Error('Dimensions not mentioned.');
		return;
	} else if (this.param.shape.length != 2){
		throw new Error('The Tautology.Geometry only accepts 2-dimensional array.')
	}

	this.init();	
	this.update();
}

Tautology.Geometry.prototype.update = function(){
	this.code.call(this.geom.vertices, this.param, this.array);
	
	(this.param.post) && this.param.post();

	this.geom.verticesNeedUpdate = true;
	this.geom.computeFaceNormals();
	this.geom.computeVertexNormals();
	this.geom.normalsNeedUpdate = true;
}

Tautology.Geometry.prototype.init = function(){
	this.array = Array.permute(this.param.shape);

	this.geom = new THREE.Geometry();
	this.geom.vertices = this.array.map(function(e){return new THREE.Vector3()});
	
	this.geom.faces = Array.grid(this.param.shape);
	this.geom.faceVertexUvs = this.array.map(function(e){return new THREE.Vector2()})


}