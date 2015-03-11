Tautology.Material = function(param){
	// Get the parameters out of the uniformed parameter data structure
	// subsequent modification of the parameter data structure will not
	// involve further memory operation.
	this.param = {};
	this.materials = {};
	this.initMaterial(param);
	this.updateMaterial(param);
}

Tautology.Material.prototype.constructor = Tautology.Material;

Tautology.Material.prototype.omittedValues = [ 'mainType', 'transparency', 'transparent', 'side', '_needsUpdate'];

Tautology.Material.prototype.initMaterial = function(param){

	var type = function(type){
		return ({
			'basic' : 'MeshBasicMaterial',
			'lambert' : 'MeshLambertMaterial',
			'phong' : 'MeshPhongMaterial'
		})[type]
	};

	if ( param.transparency == 'transparent' ){
		this.materials.outside = new THREE[type(param.mainType)]({
			transparent: true,
			side: THREE.FrontSide,
			_needsUpdate: true
		});

		this.materials.inside = new THREE[type(param.mainType)]({
			transparent: true,
			side: THREE.BackSide,
			_needsUpdate: true
		});

	} else if ( param.transparency == 'opaque' ){
		this.materials.bothSide = new THREE[type(param.mainType)]({
			transparent: false,
			side: THREE.DoubleSide,
			_needsUpdate: true
		})
	};
	console.log(this);
};

Tautology.Material.prototype.updateMaterial = function(param){
	for (key in param) {
		if (this.omittedValues.indexOf[key] != -1)
			this.param[key] = param[key].val ? param[key].val : param[key];
	}

	for (key in this.materials){
		this.materials[key].setValues(this.param);		
	}
}