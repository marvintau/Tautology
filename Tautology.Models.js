var param1 = {
	// Adjustable parameters should include the min/max value and
	// current value that modified by slider. The parameters that
	// directly defined by user should be mentioned at first.
	bellowLength: {min:0.75, max:1.5, val:0.8},
	radius: {min: 8, max:12, val:10},
	stubLength : {min:10, max:20, val:10},
	bodyLength : {min:25, max:35, val:25},
	lengthAngle: {min:0, max: Math.PI/50, val:Math.PI/80},
	radiusAngle: {min:0, max: Math.PI/29, val:Math.PI/29},

	// Define the shape of the vertex matrix, make sure to define
	// the getter "shape".

	shape : [27, 30],

	regions : new Tautology.Regions({
		all : [undefined, undefined],
		stub : [ {slice: 1} , undefined],
		body : [ {slice: -1}, undefined],
		ridge : [{start:2, end:-2, every: 2}, undefined]
	}),
};

param1.manuever =  [
	{
		type : 'trans',
		init : function(param){
			this.translation = new THREE.Vector3();
			this.indices = param.regions.compiled['stub'];
		},
		update : function(param, vertices){
			this.translation.set(-param.stubLength.val, 0, 0);
			this.indices.forEach(function(i){
				vertices[i].add(this.translation);
			}.bind(this));
		}
	},
	{
		type : 'trans',
		init : function(param){
			this.translation = new THREE.Vector3();
			this.indices = param.regions.compiled['body'];
		},
		update : function(param, vertices){
			this.translation.set(param.bodyLength.val, 0, 0);
			this.indices.forEach(function(i){
				vertices[i].add(this.translation);
			}.bind(this));
		}
	},
	{
		type : 'trans',
		init : function(param){
			this.translation = new THREE.Vector3();
			this.indices = param.regions.compiled['ridge'];
		},
		update : function(param, vertices){
			this.translation.set(1.3, 0, 1);
			this.indices.forEach(function(i){
				vertices[i].add(this.translation);
			}.bind(this));
		}
	},
	{	
		desc : 'roll around the centeroid axis of the straw',
		init : function(param){
			this.axisX = new THREE.Vector3(1, 0, 0);
			this.feed = new THREE.Vector3();
			this.matrices = Array.constDeep(param.shape[1], THREE.Matrix4);
			this.indices = param.regions.compiled['all'];
		},
		update : function(param, vertices){
			this.feed.set(0, -Math.sin(param.radiusAngle.max)*param.radius.val, 0);
			this.matrices[0].makeRotationAxis(this.axisX, 2*(param.radiusAngle.val) );
			this.matrices[0].setPosition(this.feed);

			for (var i = 1; i < this.matrices.length; i++) {
				this.matrices[i].multiplyMatrices(this.matrices[i-1], this.matrices[0]);
			};

			this.indices.forEach(function(i){
				vertices[i].applyMatrix4(this.matrices[param.array[i][1]]);
			}.bind(this));
		}
	},
	{	
		desc : 'bend the accordion-like ridge part',
		init : function(param){
			this.axisZ = new THREE.Vector3(0, 0, 1);
			this.feed = new THREE.Vector3();
			this.matrices = Array.constDeep(param.shape[0], THREE.Matrix4);
			this.indices = param.regions.compiled['all'];
		},
		update : function(param, vertices){
			this.feed.set(param.bellowLength.val, 0, 0);
			this.matrices[0].makeRotationAxis( this.axisZ, 2*param.lengthAngle.val) ;
			this.matrices[0].setPosition(this.feed);

			for(var i = 1; i < this.matrices.length; i++){
				this.matrices[i].multiplyMatrices(this.matrices[i-1], this.matrices[0]);
			};

			this.indices.forEach(function(i){
				vertices[i].applyMatrix4(this.matrices[param.array[i][0]]);
			}.bind(this));

		}
	}
];