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

	this.shape = shape;

	this.labels = this.shape.reduce(function(perms, dim){
		return Array.range(dim).outer(perms, function(d, perm){
			return perm.concat(d);
		}).flatten();
	},[[]]);

	this.vertices = this.labels.map(function(e){return new THREE.Vector3()});

	this.texels = this.labels.map(function(e){return new THREE.Vector2()});

	this.faces = Array.grid(this.shape);

	this.regions = {};
	for(key in regions){
		this.regions[key] = new Tautology.Region(regions[key], this.shape);
	}

	this.instructions = [];
	
	manuever.forEach(function(step){
		this.instructions.push(new Tautology.Transform(this, step));
	}.bind(this));

	this.init(this.shape);
	this.update();
}

Tautology.Geometry.prototype.constructor = Tautology.Geometry;

Tautology.Geometry.prototype.init = function(){
	this.geom && this.geom.dispose();

	this.geom = new THREE.Geometry();
	this.geom.vertices = this.vertices;
	this.geom.faces = this.faces;
	this.geom.faceVertexUvs = [];
	this.geom.faceVertexUvs.push(this.faces.map(function(face){
		return [this.texels[face.a], this.texels[face.b], this.texels[face.c]];
	}.bind(this)));

}

Tautology.Geometry.prototype.update = function(){

	this.vertices.forEach(function(e){
		e.set(0, 0, 0);
	})

	this.instructions.forEach(function(inst){
		inst.update();
	}.bind(this));
	this.geom.verticesNeedUpdate = true;
	this.geom.uvsNeedUpdate = true;
	this.geom.computeFaceNormals();
	// this.geom.computeVertexNormals();
	this.geom.normalsNeedUpdate = true;

}