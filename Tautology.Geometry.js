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
Tautology.Geometry = function(param, shape, regions, manuever){
	this.param = param;

	this.shape = new Tautology.Shape(shape);

	this.regions = {};
	for(key in regions){
		this.regions[key] = new Tautology.Region(regions[key], shape);
	}

	this.instructions = [];
	
	manuever.forEach(function(step){
		this.instructions.push(new Tautology.Transform(this, step));
	}.bind(this));

	this.initGeom(this.shape);
	this.updateGeom();
}

Tautology.Geometry.prototype.constructor = Tautology.Geometry;

Tautology.Geometry.prototype.initGeom = function(shape){
	this.geom = new THREE.Geometry();
	this.geom.vertices = shape.vertices;
	this.geom.faces = Array.grid(shape.shape);
	this.geom.faceVertexUvs = shape.labels.map(function(e){return new THREE.Vector2()});

}

Tautology.Geometry.prototype.updateGeom = function(){

	this.shape.vertices.forEach(function(e){
		e.set(0, 0, 0);
	})

	this.instructions.forEach(function(inst){
		inst.update();
	}.bind(this));
	this.geom.verticesNeedUpdate = true;
	this.geom.computeFaceNormals();
	this.geom.normalsNeedUpdate = true;

}