Tautology.Model = function(model, texture){
	this.model = model;

	this.texture = texture;

	this.geom = new Tautology.Geometry(this.model.param.geom, this.model.shape, this.model.regions, this.model.manuever);
	this.material = new Tautology.Material(this.model.param.material, this.texture);
	this.meshes = new THREE.Object3D();
	this.meshes.add(new THREE.Mesh(this.geom.geom, this.material.materials.outside));
	this.meshes.add(new THREE.Mesh(this.geom.geom, this.material.materials.inside));
}

Tautology.Model.prototype.constructor = Tautology.Model;

Tautology.Model.prototype.updateScene = function(scene) {
	scene.add(this.meshes);
}