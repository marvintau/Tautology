/**
 * BentStrawEditor
 * @param {} stubLengthControl
 * @param {} bodyLengthControl
 * @param {} radiusControl
 * @param {} curvatureControl
 * @constructor
 */
Tautology.BentStrawEditor = function(stubLengthControl, bodyLengthControl, radiusControl, curvatureControl){
	this.stubLengthControl = stubLengthControl;
	this.bodyLengthControl = bodyLengthControl;
	this.radiusControl = radiusControl;
	this.curvatureControl = curvatureControl;
	this.model;
}

Tautology.BentStrawEditor.prototype.constructor = Tautology.BentStrawEditor,

/**
 * [init description]
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
Tautology.BentStrawEditor.prototype.init = function(scene, material, canvas){
	this.model = new Tautology.BentStraw(scene,
		this.stubLengthControl.val()/10,
		this.bodyLengthControl.val()/10,
		this.radiusControl.val()/10
	);


	this.model.init(material);

	this.radiusControl.on("input change", function(e) {
		this.model.updateRadius(e.target.valueAsNumber/10);
		canvas.resize(
			(this.model.shortLength + this.model.longLength + this.model.bellowAngle * this.model.bellowRadius * 2) * 20,
			e.target.valueAsNumber/10 * Math.PI * 2 * 20
		);
		this.model.geom.updateGeom(true);			
	}.bind(this));

	this.stubLengthControl.on("input change", function(e) {
		this.model.updateShortLength(e.target.valueAsNumber/10);
		canvas.resize(
			(e.target.valueAsNumber/10 + this.model.longLength + this.model.bellowAngle * this.model.bellowRadius * 2) * 20,
			straw['straight'].radius * Math.PI * 2 * 20
		);
		this.model.geom.updateGeom(true);						
	}.bind(this));

	this.bodyLengthControl.on("input change", function(e) {
		this.model.updateLongLength(e.target.valueAsNumber/10);
		canvas.resize(
			(this.model.shortLength + e.target.valueAsNumber/10 + this.model.bellowAngle * this.model.bellowRadius * 2) * 20,
			straw['straight'].radius * Math.PI * 2 * 20
		);
		this.model.geom.updateGeom(true);						
	}.bind(this));

	this.curvatureControl.on("input change", function(e) {
		this.model.updateCurvature(e.target.valueAsNumber/100*Math.PI);
	}.bind(this));
};

/**
 * [show description]
 * @return {[type]}
 */
Tautology.BentStrawEditor.prototype.show = function(){
	this.model.addModel();
};

/**
 * [hide description]
 * @return {[type]}
 */
Tautology.BentStrawEditor.prototype.hide = function(){
	this.model.removeModel();
};

/**
 * [resize description]
 * @param  {[type]}
 * @return {[type]}
 */
Tautology.BentStrawEditor.prototype.resize = function(canvas){
	canvas.resize(
		(this.model.shortLength + this.model.longLength + this.model.bellowAngle * this.model.bellowRadius * 2) * 20,
		this.model.radius * Math.PI * 2 * 20
	);

};
