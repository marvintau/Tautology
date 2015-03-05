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
Tautology.Geometry = function(param){
	this.param = param;

	this.make();
}

Tautology.Geometry.prototype.constructor = Tautology.Geometry;

Tautology.Geometry.prototype.make = function(){
	// 1. Generate the shape. First check whether the parameter list
	//    contains the shape function.
	if(!this.param.shape){
		throw new Error('Dimensions not mentioned.');
		return;
	}

	this.initGeom();	
	this.updateGeom();
}

Tautology.Geometry.prototype.initGeom = function(){
	var shape = this.param.shape;
	this.param.array = Array.permute(shape);

	// This part is suggested to be moved to a class dedicated to handle the
	// model specification
	var regions = this.param.regions,
		modifiers = this.param.regionModifiers;

	regions.getDimensionTables(shape);
	regions.compile(this.param.array, shape);
	
	var manuever = this.param.manuever;
	manuever.forEach(function(step){
		step.init.call(step, this.param);
	}.bind(this));

	this.geom = new THREE.Geometry();
	this.geom.vertices = this.param.array.map(function(e){return new THREE.Vector3()});
	
	this.geom.faces = Array.grid(shape);
	this.geom.faceVertexUvs = this.param.array.map(function(e){return new THREE.Vector2()})

}

Tautology.Geometry.prototype.updateGeom = function(){

	// this.code.call(this.geom.vertices, this.param);

	var manuever = this.param.manuever;
	this.geom.vertices.forEach(function(e){
		e.set(0, 0, 0);
	})
	manuever.forEach(function(step){
		step.update.call(step, this.param, this.geom.vertices);
	}.bind(this));

	this.geom.verticesNeedUpdate = true;
	this.geom.computeFaceNormals();
	this.geom.computeVertexNormals();
	this.geom.normalsNeedUpdate = true;
}