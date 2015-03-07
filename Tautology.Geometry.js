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

	this.param.array = Array.permute(this.param.shape);

	this.vertices = this.param.array.map(function(e){return new THREE.Vector3()});

	// This part is suggested to be moved to a class dedicated to handle the
	// model specification
	var regions = this.param.regions,
		modifiers = this.param.regionModifiers;

	regions.getDimensionTables(this.param.shape);
	regions.compile(this.param.array, this.param.shape);
	
	var instructions = this.param.instructions = [];
	
	this.param.manuever1.forEach(function(step){
		var newTran = new Tautology.Trans(this.param, this.vertices, step.region);
		(newTran[step.command])(step.callback, step.dimension);
		instructions.push(newTran);

	}.bind(this));

	this.geom = new THREE.Geometry();
	this.geom.vertices = this.vertices;
	
	this.geom.faces = Array.grid(this.param.shape);
	this.geom.faceVertexUvs = this.param.array.map(function(e){return new THREE.Vector2()})

	this.updateGeom();
}

Tautology.Geometry.prototype.constructor = Tautology.Geometry;

Tautology.Geometry.prototype.updateGeom = function(){

	// this.code.call(this.geom.vertices, this.param);

	var manuever = this.param.manuever;
	this.vertices.forEach(function(e){
		e.set(0, 0, 0);
	})
	// manuever.forEach(function(step){
	// 	step.update.call(step, this.param, this.vertices);
	// }.bind(this));

	this.param.instructions.forEach(function(inst){
		inst.update();
		this.geom.verticesNeedUpdate = true;
		this.geom.computeFaceNormals();
		this.geom.computeVertexNormals();
		this.geom.normalsNeedUpdate = true;
	}.bind(this));

}