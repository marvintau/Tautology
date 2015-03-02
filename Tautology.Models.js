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

	shape : {
		bellow : 27, circum : 30
	},

	regions : {
		stub : [ {slice: 1} , ],
		body : [ {slice: -1}, ],
		bellow : [{start:2, end:-2, every: 2}, ]
	},

	regionModifiers : [
		{	// if undefined on that slot, return true
			typeCond : function(ithSpec){ return !ithSpec },
			cond : function(){return 1;}
		},
		{	// Accepts {start: , end: , every : , shift : ,}
			typeCond : function(ithSpec){ return ithSpec && ithSpec.start },
			cond : function(dim, ithSpec, ithShape){
				var r = function(i, r){ return (i > 0) ? (i - 1) : (r + i); };

				var isInInterval = dim >= r(ithSpec.start, ithShape) && dim <= r(ithSpec.end, ithShape);
				return isInInterval && ((dim + (ithSpec.shift ? ithSpec.shift : 0)) % (ithSpec.every ? ithSpec.every : 1) == 0 );
			}
		},
		{	// Accepts {slice:}
			typeCond : function(ithSpec){ return ithSpec && ithSpec.slice },
			cond : function(dim, ithSpec, ithShape){
				var r = function(i, r){ return (i > 0) ? (i - 1) : (r + i); };				
				return dim == r(ithSpec.slice, ithShape);
			}
		}
	],

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

	param.trans.set(0, -Math.sin(Math.PI/(param.shape.circum-1))*param.radius.val, 0);
	param.leng.set(param.bellowLength.val, 0, 0);

	param.transRollMatrix.makeRotationAxis( param.axisX, 2*(Math.PI/(param.shape.circum-1)) );
	param.transRollMatrix.setPosition(param.trans);

	param.lengthRollMatrix.makeRotationAxis( param.axisZ, 2*param.lengthAngle.val);
	param.lengthRollMatrix.setPosition(param.leng);

	this.forEach(function(e){e.set(0, 0, 0)});

	param.regions.stub.map(function(i){
		this[i].add(new THREE.Vector3(-param.stubLength.val, 0, 0))
	}.bind(this));

	param.regions.body.map(function(i){
		this[i].add(new THREE.Vector3(param.bodyLength.val, 0, 0));
	}.bind(this));

	param.regions.bellow.map(function(i){
		this[i].add(new THREE.Vector3(1.3, 0, 1));
	}.bind(this));

	for (var i = 0; i < this.length; i++) {

		this[i].roll(param.array[i][1], param.transRollMatrix);
		this[i].roll(param.array[i][0], param.lengthRollMatrix);

	};
}
