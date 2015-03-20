Tautology.ModelManager = function(models, materialParam, canvas){
	this.models = {};

	this.texture = new THREE.Texture( canvas.getElement() );
	this.texture.needsUpdate = true;

	this.material = new Tautology.Material(materialParam, this.texture);

	canvas.on('after:render', function(){
		this.texture.needsUpdate = true;
	}.bind(this));

	for (key in models){
		this.models[key] = new Tautology.Model(models[key].model, this.material, this.texture);
	}
	this.currentModelKey = (Object.keys(models))[0];
}

Tautology.ModelManager.prototype.constructor = Tautology.Model;

Tautology.ModelManager.prototype.update = function(scene) {
	for(var i = 0; i < scene.children.length; i++){
		if(scene.children[i].type == "Object3D"){
			console.log('found');
			scene.remove(scene.children[i]);
		}
	}

	scene.add(this.models[this.currentModelKey].meshes);
}