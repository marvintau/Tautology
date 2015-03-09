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

	this.shape = new Tautology.Shape(this.param.shape);

	this.param.array = this.shape.labels;

	this.vertices = this.shape.vertices;

	var regions = this.param.regions,
		modifiers = this.param.regionModifiers;

	regions.getDimensionTables(this.param.shape);
	regions.compile(this.param.array, this.param.shape);
	
	var instructions = this.param.instructions = [];
	
	this.param.manuever.forEach(function(step){
		var newTran = new Tautology.Transform(this.param, this.shape, this.param.regions, step.region);
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

	this.vertices.forEach(function(e){
		e.set(0, 0, 0);
	})

	this.param.instructions.forEach(function(inst){
		inst.update();
		this.geom.verticesNeedUpdate = true;
		this.geom.computeFaceNormals();
		this.geom.computeVertexNormals();
		this.geom.normalsNeedUpdate = true;
	}.bind(this));

}