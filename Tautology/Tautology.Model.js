Tautology.Model = function(model, material, texture){
	this.model = model;

	this.geom = new Tautology.Geometry(this.model);
	this.meshes = new THREE.Object3D();
	this.meshes.add(new THREE.Mesh(this.geom.geom, material.materials.outside));
	this.meshes.add(new THREE.Mesh(this.geom.geom, material.materials.inside));
}

Tautology.Model.prototype.constructor = Tautology.Model;