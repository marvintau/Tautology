Tautology.Material = function(param, texture){
	// Get the parameters out of the uniformed parameter data structure
	// subsequent modification of the parameter data structure will not
	// involve further memory operation.
	this.param = param;
	this.texture = texture;
	this.materials = {};
	this.init();
	this.update();
}

Tautology.Material.prototype.constructor = Tautology.Material;

Tautology.Material.prototype.init = function(){

	var type = function(type){
		return ({
			'basic' : 'MeshBasicMaterial',
			'lambert' : 'MeshLambertMaterial',
			'phong' : 'MeshPhongMaterial',
			'point' : 'PointCloudMaterial'
		})[type]
	};

	(this.materials.outside) && this.materials.outside.dispose();
	this.materials.outside = new THREE[type(this.param.mainType)]({
		map : this.texture ? this.texture : null,
		opacity : this.param.opacity.val,
		transparent: true,
		side: THREE.FrontSide,
		_needsUpdate: true
	});

	(this.materials.inside) && this.materials.inside.dispose();
	this.materials.inside = new THREE[type(this.param.mainType)]({
		map : this.texture ? this.texture : null,
		opacity : this.param.opacity.val,
		transparent: true,
		side: THREE.BackSide,
		_needsUpdate: true
	});
};

Tautology.Material.prototype.update = function(){
	this.materials.outside.color.setHex(this.param.color);
	this.materials.inside.color.setHex(this.param.color);

	this.materials.outside.opacity = this.param.opacity.val;
	this.materials.inside.opacity = this.param.opacity.val;
}