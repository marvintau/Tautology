var param1 = {
	// Adjustable parameters should include the min/max value and
	// current value that modified by slider. The parameters that
	// directly defined by user should be mentioned at first.
	bellowLength: {min:0.75, max:1.5, val:0.8},
	radius: {min: 8, max:12, val:10},
	stubLength : {min:10, max:20, val:10},
	bodyLength : {min:25, max:35, val:25},
	lengthAngle: {min:0, max: Math.PI/50, val:Math.PI/80},

	// Define the shape of the vertex matrix, make sure to define
	// the getter "shape".
	bellowResolution : 27,
	circumResolution: 30,
	get shape() {
		return [this.bellowResolution, this.circumResolution]
	},

	// The constants that derived from the adjustable parameters
	// yet not accompanied with vertex index should be defined as
	// getters.
	trans: new THREE.Vector3(),

	leng: new THREE.Vector3(),

	axisX : new THREE.Vector3(1, 0, 0),

	axisZ : new THREE.Vector3(0, 0, 1),

	transRollMatrix : new THREE.Matrix4(),

	lengthRollMatrix : new THREE.Matrix4()
};

var code1 = function(param){

	param.trans.set(0, -Math.sin(Math.PI/(param.circumResolution-1))*param.radius.val, 0);
	param.leng.set(param.bellowLength.val, 0, 0);

	param.transRollMatrix.makeRotationAxis( param.axisX, 2*(Math.PI/(param.circumResolution-1)) );
	param.transRollMatrix.setPosition(param.trans);

	param.lengthRollMatrix.makeRotationAxis( param.axisZ, 2*param.lengthAngle.val);
	param.lengthRollMatrix.setPosition(param.leng);

	for (var i = this.length - 1; i >= 0; i--) {
		this[i].set(0, 0, 0);
		if (param.array[i][0]== 0)
			this[i].add(new THREE.Vector3(-param.stubLength.val, 0, 0));
		else if (param.array[i][0]== param.bellowResolution-1)
			this[i].add(new THREE.Vector3(param.bodyLength.val, 0, 0));
		else
			this[i].add(new THREE.Vector3(((param.array[i][0]+1)%2)+0.3, 0, (param.array[i][0]+1)%2));

		this[i].roll(param.array[i][1], param.transRollMatrix);
		this[i].roll(param.array[i][0], param.lengthRollMatrix);

	};
}
