Tautology.StrawModelSelector = function(modelTabs, modelEditors){
	this.modelTabs = modelTabs;
	this.modelEditors = modelEditors;
}

Tautology.StrawModelSelector.prototype = {
	constructor : Tautology.StrawModelSelector,

	init : function(scene, material, canvas){
		var modelKeys = Object.keys(this.modelTabs);

		modelKeys.map(function(key){
			this.modelEditors[key].init(scene, material, canvas);
			this.modelTabs[key].on('shown.bs.tab', function(e){
				modelKeys.map(function(key){this.modelEditors[key].hide()}.bind(this));
				
				this.modelEditors[key].resize(canvas);
				this.modelEditors[key].show();
			}.bind(this));

		}.bind(this));

		this.modelEditors[modelKeys[0]].resize(canvas);
		this.modelEditors[modelKeys[0]].show();
	}
}