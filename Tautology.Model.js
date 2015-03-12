Tautology.Model = function(model){
	this.model = model;
	this.geom = new Tautology.Geometry(this.model.param.geom, this.model.shape, this.model.regions, this.model.manuever);
	this.material = new Tautology.Material(model.param.material);
}

Tautology.Model.prototype.constructor = Tautology.Model;

Tautology.Model.prototype.updateScene = function(scene) {
	for(key in this.material.materials)
		if(key == 'point')
			scene.add(new THREE.PointCloud(this.geom.geom));	
		else 
			scene.add(new THREE.Mesh(this.geom.geom, this.material.materials[key]));
}