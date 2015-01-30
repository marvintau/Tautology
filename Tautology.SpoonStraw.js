/**
 * SpoonStraw creates an adjustable straw object
 * @param {THREE.Scene} scene the scene to render
 * @param {Number} length the length of straw
 * @param {Number} radius the radius of straw
 * @constructor
 */
Tautology.SpoonStraw = function(scene, length, radius){
	/**
	 * @private
	 */
	this._resolution = 40;
	/**
	 * @private
	 * @type {Number}
	 */
	this.radius = (radius == undefined) && 2.5 || radius;
	/**
	 * @private
	 * @type {Number}
	 */
	this.length = (length == undefined) && 50|| length;
	/**
	 * @private
	 * @type {Tautology.Array}
	 */
	this.vertices = new Tautology.Array();
	/**
	 * @private
	 * @type {Array}
	 */
	this.spoonVertices = null;
	/**
	 * @private
	 * @type {Array}
	 */
	this.jointVertices = null;

	this.strawGeom = new Tautology.MeshGeometry();
	this.spoonGeom = null;
	this.jointGeom = null;
	this.pack = new THREE.Object3D();
	/**
	 * @private
	 */
	this.scene = scene;

}

Tautology.SpoonStraw.prototype.constructor = Tautology.SpoonStraw;

/**
 * Init the straw object
 * @param  {Array} material An array of different materials
 */
Tautology.SpoonStraw.prototype.init = function (material) {
	this.vertices.init([new THREE.Vector3(0, 0, 0)]);
	this.vertices.dup(this._resolution+1);
	this.vertices.flatten();
	this.vertices.dup(2);

	this.strawGeom.init(this.vertices, 0, 1, 0, 1);
	this.updateVertices();
	this.strawGeom.generateGeom(true);
	
	this.createSpoonGeom();
	this.updateSpoonGeom();

	var spoonInside = new THREE.MeshLambertMaterial({
    	color:0xffffff,
		opacity: 0.6,
		transparent: true,
		side: THREE.FrontSide
	}); 

	var spoonOutside = new THREE.MeshLambertMaterial({
    	color:0xffffff,
		opacity: 0.6,
		transparent: true,
		side: THREE.BackSide
	}); 


	this.pack.add(new THREE.Mesh(this.strawGeom.geom, material['outside-mapped']));
	this.pack.add(new THREE.Mesh(this.jointGeom, material['outside']));
	this.pack.add(new THREE.Mesh(this.spoonGeom, material['outside']));
	
	this.pack.add(new THREE.Mesh(this.strawGeom.geom, material['inside-mapped']));
	this.pack.add(new THREE.Mesh(this.jointGeom, material['inside']));
	this.pack.add(new THREE.Mesh(this.spoonGeom, material['inside']));
	
};

/**
 * create the geometry model of the spoon part
 */
Tautology.SpoonStraw.prototype.createSpoonGeom = function(){
	var generateControlPoints = function(radius, width, bodyLength){
		var table = {};
		table['body'] =[ 
			[ 	[1, 0, 0, 1], [1, -1, 0, Math.sqrt(0.5)],
				[0, -1, 0, 1], [-1, -1, 0, Math.sqrt(0.5)],
				[-1, 0, 0, 1]
			],
			[	[1, 1, 2, 1],
				[1, -1, 2, 1],
				[0, -1, 2, 1],
				[-1, -1, 2, 1],
				[-1, 1, 2, 1]
			],
			[	[width, 0, bodyLength+2, 1], [1, -1, bodyLength, 1],
				[0, -1, bodyLength, 1], [-1, -1, bodyLength, 1],
				[-width, 0, bodyLength+2, 1] 
			],
			[	[0.3, -1, bodyLength+2, 1], [0, -1, bodyLength+2, 1],
				[0, -1, bodyLength+2, 1], [0, -1, bodyLength+2, 1],
				[-0.3, -1, bodyLength+2, 1]
			]
		];

		table['body'] = table['body'].map(function(list){
			return list.map(function(a){
				var v = new THREE.Vector4();
				v.fromArray(a);
				v.multiplyScalar(radius);
				v.w /= radius;
				return v;
			})
		});

		return table;
	}

	var controlPointsBody = generateControlPoints(this.radius, 4, 5)['body'];

	var degreeBody = 3;
	var degreeCircum = 2;
	var knotsBody = [0, 0, 0, 0, 1, 1, 1, 1];
	var knotsCircum = [0, 0, 0, 1, 1, 2, 2, 2];
	var nurbsBody = new Tautology.NURBSSurface(degreeBody, degreeCircum,
										   knotsBody, knotsCircum,
										   controlPointsBody);

	this.spoonGeom = new THREE.ParametricGeometry(function(u, v) {
		return nurbsBody.getPoint(u, v);
	}, 20, 20 );

	this.jointGeom = new THREE.ParametricGeometry(function(u, v) {
		var vec= new THREE.Vector3(
				Math.sin((1-u)*Math.PI*2),
				Math.cos((1-u)*Math.PI*2),
				v * ((u<=0.25 || u>=0.75)? 1-(Math.cos(u*Math.PI*2)): 1)
			);
		vec.multiplyScalar(this.radius);
		return vec;
	}.bind(this), 40, 1);

	this.spoonGeom.applyMatrix((new THREE.Matrix4()).makeTranslation(0, 0, this.radius));
	this.spoonGeom.applyMatrix((new THREE.Matrix4()).makeRotationY(Math.PI/2));
	this.jointGeom.applyMatrix((new THREE.Matrix4()).makeRotationY(Math.PI/2));
	
	this.spoonGeom.computeFaceNormals();
	this.jointGeom.computeFaceNormals();
	this.spoonGeom.computeVertexNormals();
	this.jointGeom.computeVertexNormals();

	this.spoonVertices = this.spoonGeom.vertices.map(function(v){return v.clone()});
	this.jointVertices = this.jointGeom.vertices.map(function(v){return v.clone()});
};

/**
 * Add the packed model to scene
 */
Tautology.SpoonStraw.prototype.addModel = function(){
	this.scene.add(this.pack);
};

/**
 * Remove packed model from the scene
 */
Tautology.SpoonStraw.prototype.removeModel = function(){
	this.scene.remove(this.pack);
};

/**
 * Update straw body vertices
 */
Tautology.SpoonStraw.prototype.updateVertices = function(){
	_this = this;
	(this.strawGeom.geom != null) && (this.strawGeom.geom.verticesNeedUpdate = true);

	this.vertices.applyFunc(function(){
		this.object.set(0, 0, 0);
		this.index.index[0] == 0 && this.object.add(new THREE.Vector3(_this.length/2, 0, 0));
		this.index.index[0] == 1 && this.object.add(new THREE.Vector3(-_this.length/2, 0, 0));
		this.object.add(new THREE.Vector3(0, _this.radius, 0));
		this.object.applyAxisAngle(new THREE.Vector3(1, 0, 0),
								2*Math.PI*this.index.index[1]/_this._resolution);
	})
};

/**
 * Update straw spoon part vertices
 */
Tautology.SpoonStraw.prototype.updateSpoonGeom = function(){
	for(i = 0; i < this.spoonVertices.length; i++){
		this.spoonGeom.verticesNeedUpdate = true;
		this.spoonGeom.vertices[i].copy(this.spoonVertices[i]);
		this.spoonGeom.vertices[i].multiplyScalar(this.radius/2.5);
		this.spoonGeom.vertices[i].add(new THREE.Vector3(this.length/2, 0, 0));
	}

	for(i = 0; i < this.jointVertices.length; i++){
		this.jointGeom.verticesNeedUpdate = true;
		this.jointGeom.vertices[i].copy(this.jointVertices[i]);
		this.jointGeom.vertices[i].multiplyScalar(this.radius/2.5);
		this.jointGeom.vertices[i].add(new THREE.Vector3(this.length/2, 0, 0));
	}

};

/**
 * Update the straw body length
 * @param {Number} length Length of straw
 */
Tautology.SpoonStraw.prototype.updateLength = function(length){
	this.length = length;
	console.log('called');
	this.updateVertices();
	this.updateSpoonGeom();
};

/**
 * Update the straw body radius
 * @param {Number} radius Radius of straw
 */
Tautology.SpoonStraw.prototype.updateRadius = function(radius){
	this.radius = radius;
	this.updateVertices();
	this.updateSpoonGeom();
};
