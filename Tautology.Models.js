var param1 = {
	// Define the shape of the vertex matrix, make sure to define
	// the getter "shape".
	bellowResolution : 27,
	circumResolution: 30,
	get shape() {
		return [this.bellowResolution, this.circumResolution]
	},

	// Adjustable parameters should include the min/max value and
	// current value that modified by slider.
	bellowLength: {min:0.75, max:1.5, val:0.8},
	radius: {min: 8, max:12, val:10},
	stubLength : {min:10, max:20, val:10},
	bodyLength : {min:25, max:35, val:25},
	lengthAngle: {min:0, max: Math.PI/50, val:Math.PI/80},

	// The constants that derived from the adjustable parameters
	// yet not accompanied with vertex index should be defined as
	// getters.
	get trans() {
		return new THREE.Vector3(0, -Math.sin(Math.PI/29)*this.radius.val, 0);
	},

	get leng() {
		return new THREE.Vector3(this.bellowLength.val, 0, 0);
	}
};

var code1 = function(param, array){

	var transRollMatrix = new THREE.Matrix4();
		transRollMatrix.makeRotationAxis( new THREE.Vector3(1, 0, 0), 2*(Math.PI/29) );
		transRollMatrix.setPosition(param.trans);

	var lengRollMatrix = new THREE.Matrix4();
		lengRollMatrix.makeRotationAxis(new THREE.Vector3(0, 0, 1), 2*param.lengthAngle.val);
		lengRollMatrix.setPosition(param.leng);

	for (var i = this.length - 1; i >= 0; i--) {
		this[i].set(0, 0, 0);
		if (array[i][0]== 0)
			this[i].add(new THREE.Vector3(-param.stubLength.val, 0, 0));
		else if (array[i][0]== param.bellowResolution-1)
			this[i].add(new THREE.Vector3(param.bodyLength.val, 0, 0));
		else
			this[i].add(new THREE.Vector3(((array[i][0]+1)%2)+0.3, 0, (array[i][0]+1)%2));

		this[i].roll(array[i][1], transRollMatrix);
		this[i].roll(array[i][0], lengRollMatrix);

	};
}
