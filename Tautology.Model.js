Tautology.Model = function(model, canvas){
	this.model = model;

	this.texture = new THREE.Texture( canvas.getElement() );
	// this.texture.repeat.set(-1, -1);
	// this.texture.offset.set(1,1);
	this.texture.needsUpdate = true;

	this.geom = new Tautology.Geometry(this.model.param.geom, this.model.shape, this.model.regions, this.model.manuever);
	this.material = new Tautology.Material(this.model.param.material, this.texture);

	canvas.on('after:render', function(){
	
		this.texture.needsUpdate = true;
	}.bind(this));
}

Tautology.Model.prototype.constructor = Tautology.Model;

Tautology.Model.prototype.updateScene = function(scene) {
	for(key in this.material.materials)
		if(key == 'point')
			scene.add(new THREE.PointCloud(this.geom.geom));	
		else 
			scene.add(new THREE.Mesh(this.geom.geom, this.material.materials[key]));
}