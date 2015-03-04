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
Tautology.Geometry = function(param, init, loop){
	this.param = param;
	this.init = init;
	this.code = loop;

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

Tautology.Geometry.prototype.updateGeom = function(){

	this.code.call(this.geom.vertices, this.param);
	(this.param.post) && this.param.post();

	this.geom.verticesNeedUpdate = true;
	this.geom.computeFaceNormals();
	this.geom.computeVertexNormals();
	this.geom.normalsNeedUpdate = true;
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
	
	var transforms = this.param.transforms;
	for (key in transforms) {
		if(transforms[key].affectedDimension != undefined){
			transforms[key]['dimIndex'] = regions.dimensionTables[transforms[key].affectedRegion][transforms[key].affectedDimension];
			transforms[key]['matrices'] = Array.constDeep(transforms[key]['dimIndex'].length, THREE.Matrix4);
		}
	}

	this.geom = new THREE.Geometry();
	this.geom.vertices = this.param.array.map(function(e){return new THREE.Vector3()});
	
	this.geom.faces = Array.grid(shape);
	this.geom.faceVertexUvs = this.param.array.map(function(e){return new THREE.Vector2()})


}