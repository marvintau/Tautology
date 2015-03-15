Tautology.Material = function(param, texture){
	// Get the parameters out of the uniformed parameter data structure
	// subsequent modification of the parameter data structure will not
	// involve further memory operation.
	this.param = {};
	this.texture = texture;
	this.materials = {};
	this.initMaterial(param);
	this.updateMaterial(param);
}

Tautology.Material.prototype.constructor = Tautology.Material;

Tautology.Material.prototype.initMaterial = function(param){

	var type = function(type){
		return ({
			'basic' : 'MeshBasicMaterial',
			'lambert' : 'MeshLambertMaterial',
			'phong' : 'MeshPhongMaterial',
			'point' : 'PointCloudMaterial'
		})[type]
	};

	this.materials.outside = new THREE[type(param.mainType)]({
		map : this.texture ? this.texture : null,
		transparent: true,
		side: THREE.FrontSide,
		_needsUpdate: true
	});

	this.materials.inside = new THREE[type(param.mainType)]({
		map : this.texture ? this.texture : null,
		transparent: true,
		side: THREE.BackSide,
		_needsUpdate: true
	});
};

Tautology.Material.prototype.updateMaterial = function(param){
	for (key in param) {
		this.param[key] = param[key].val ? param[key].val : param[key];
	}

	for (key in this.materials){
		this.materials[key].setValues(this.param);		
	}
}