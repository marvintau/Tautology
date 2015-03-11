Tautology.Material = function(param, type, trans){
	// Get the parameters out of the uniformed parameter data structure
	// subsequent modification of the parameter data structure will not
	// involve further memory operation.
	this.param = {};
	this.initMaterial(type, trans);
	this.updateMaterial(param);	
}

Tautology.Material.prototype.constructor = Tautology.Material;

Tautology.Material.prototype.initMaterial = function(materialType, trans){

	var type = function(materialType){
		return ({
			'basic' : 'MeshBasicMaterial',
			'lambert' : 'MeshLambertMaterial',
			'phong' : 'MeshPhongMaterial'
		})[materialType]
	};

	if(trans == 'transparent'){
		this.materials={
			outside : new THREE[type(materialType)]({
				transparent: true,
				side: THREE.FrontSide,
				_needsUpdate: true
			}),

		    inside : new THREE[type(materialType)]({
				transparent: true,
				side: THREE.BackSide,
				_needsUpdate: true
			}) 	
		}		
	}else if (trans == 'opaque'){
		this.materials = new THREE[type(materialType)]({
				side: THREE.DoubleSide,
				_needsUpdate: true
			})
	}
};

Tautology.Material.prototype.updateMaterial = function(param){
	for (key in param) {
		console.log(param[key]);
		this.param[key] = param[key].val ? param[key].val : param[key];
	}

	if (this.materials.outside) {
		this.materials.outside.setValues(this.param);
		this.materials.inside.setValues(this.param);
	} else {
		this.materials.setValues(this.param);
	}
}