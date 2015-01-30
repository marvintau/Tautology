Tautology.StraightStrawEditor = function(lengthControl, radiusControl){
	this.lengthControl = lengthControl;
	this.radiusControl = radiusControl;
	this.model;
}

Tautology.StraightStrawEditor.prototype = {
	constructor : Tautology.StraightStrawEditor,
	init: function(scene, material, canvas){
		this.model = new Tautology.StraightStraw(scene,
				this.lengthControl.val()/10,
				this.radiusControl.val()/10
			);
		this.model.init(material);

		this.radiusControl.on("input change", function(e) {
			this.model.updateRadius(e.target.valueAsNumber/10);
			canvas.resize(
				this.model.length * 20,
				e.target.valueAsNumber/10 * Math.PI * 2 * 20
			);
		}.bind(this));

		this.lengthControl.on("input change", function(e) {
			this.model.updateLength(e.target.valueAsNumber/10);
			canvas.resize(
				e.target.valueAsNumber/10 * 20,
				this.model.radius * Math.PI * 2 * 20
			);

		}.bind(this));

	},

	show: function(){
		this.model.addModel();
	},

	hide: function(){
		this.model.removeModel();
	},

	resize: function(canvas){
		canvas.resize(
			this.model.length * 20,
			this.model.radius * Math.PI * 2 * 20
		);
	}
			

}