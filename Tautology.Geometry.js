/**
 * Tautology.Geometry generates the THREE.Geometry model from
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
Tautology.Geometry = function(param, codes){
	this.param = param;
	this.codes = codes;

	this.array;
	this.faces;
	this.geom;

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

	this.makeArray();
	this.makeFaces();
	this.update();
	this.makeGeom();	
}

Tautology.Geometry.prototype.update = function(){
	this.codes.forEach(function(code){
		this.array.forEach(function(elem){
			(this.geom) && (this.geom.verticesNeedUpdate = true);
			code.func.call(elem, this.param);
		}.bind(this))
	}.bind(this));	
}

Tautology.Geometry.prototype.makeArray = function(){
	this.array = Array.permute(this.param.shape).map(function(index){
			return { idx: index, 
					 vec: new THREE.Vector3(),
					 tex: new THREE.Vector2()};
		}.bind(this));
}

Tautology.Geometry.prototype.makeFaces = function(){
	this.faces = Array.grid2(this.param.shape);
}

Tautology.Geometry.prototype.makeGeom = function(){
	this.geom = new THREE.Geometry();
	this.geom.vertices = this.array.unzipFor('vec');
	
	this.geom.faces = this.faces;
	this.geom.faceVertexUvs = [this.array.unzipFor('tex')];

	this.geom.computeFaceNormals();
	this.geom.computeVertexNormals();
	this.geom.normalsNeedUpdate = true;

}