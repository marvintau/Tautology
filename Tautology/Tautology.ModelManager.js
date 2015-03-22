Tautology.ModelManager = function(models, materialParam, canvas){
	this.models = {};

	this.texture = new THREE.Texture( canvas.getElement() );
	this.texture.needsUpdate = true;

	this.material = new Tautology.Material(materialParam, this.texture);

	canvas.on('after:render', function(){
		this.texture.needsUpdate = true;
	}.bind(this));

	this.init();
}

Tautology.ModelManager.prototype.constructor = Tautology.ModelManager;

Tautology.ModelManager.prototype.init = function(){
	Object.keys(models).forEach(function(key){
		this.models[key] = {};
		this.models[key].geom = new Tautology.Geometry(models[key].model);
		console.log(key);
		this.models[key].meshes = new THREE.Object3D();
		this.models[key].meshes.add(new THREE.Mesh(this.models[key].geom.geom, this.material.materials.outside));
		this.models[key].meshes.add(new THREE.Mesh(this.models[key].geom.geom, this.material.materials.inside));		
	}.bind(this));
}

Tautology.ModelManager.prototype.select = function(key, scene) {

	for(var i = 0; i < scene.children.length; i++){
		if(scene.children[i].type == "Object3D"){
			scene.remove(scene.children[i]);
		}
	}

	scene.add(this.models[key].meshes);
}