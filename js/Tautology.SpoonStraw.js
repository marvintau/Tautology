Tautology.SpoonStraw = function(scene){
	this.resolution = 16;
	this.radius = 2.5;
	this.length = 60;
	this.vertices = new Tautology.VectorArray();
	this.spoonVertices = null;

	this.strawGeom = null;
	this.spoonGeom = null;
	this.pack = new THREE.Object3D();
	this.scene = scene;

}

Tautology.SpoonStraw.prototype = {
	constructor : Tautology.SpoonStraw,

	init : function (outside, inside) {
		this.vertices.init([new THREE.Vector3(0, 0, 0)]);
		this.vertices.dup(this.resolution+1);
		this.vertices.flatten();
		this.vertices.dup(2);

		this.updateVertices();
		
		var mg = new Tautology.MeshGeometry(this.vertices.array, 0, 1, 0, 1);
		this.strawGeom = mg.generateGeom(true);
		
		this.createSpoonGeom();
		this.updateSpoonGeom();

		var spoonInside = new THREE.MeshLambertMaterial({
	    	color:0xaaaaaa,
			opacity: 0.6,
			transparent: true,
			side: THREE.FrontSide
		}); 

		var spoonOutside = new THREE.MeshLambertMaterial({
	    	color:0xaaaaaa,
			opacity: 0.6,
			transparent: true,
			side: THREE.BackSide
		}); 


		this.pack.add(new THREE.Mesh(this.strawGeom, inside));
		this.pack.add(new THREE.Mesh(this.strawGeom, outside));
		this.pack.add(new THREE.Mesh(this.spoonGeom, spoonInside));
		this.pack.add(new THREE.Mesh(this.spoonGeom, spoonOutside));
	},

	createSpoonGeom : function(){
		var generateControlPoints = function(radius, width, bodyLength){
			var table= [ 
				[ 	[-1, 0, 0, 1], [-1, -1, 0, Math.sqrt(0.5)],
					[0, -1, 0, 1], [1, -1, 0, Math.sqrt(0.5)],
					[1, 0, 0, 1]
				],
				[	[-width, 0, 0, 1], [-1, -1, 0, 1], [0, -1, 1, 1],
					[1, -1, 1, 1], [width, 0, 0, 1]
				],
				[	[-width*.75, 0, bodyLength+2, 1], [-1, -1, bodyLength, 1],
					[0, -1, bodyLength, 1], [1, -1, bodyLength, 1],
					[width*.75, 0, bodyLength+2, 1] 
				],
				[	[0, 0, bodyLength+2, 1], [0, 0, bodyLength+2, 1],
					[0, 0, bodyLength+2, 1], [0, 0, bodyLength+2, 1],
					[0, 0, bodyLength+2, 1]
				]
			];

			return table.map(function(list){return list.map(function(a){
					var v = new THREE.Vector4();
					v.fromArray(a);
					v.multiplyScalar(radius);
					v.w /= radius;
					return v;
				})
			});
		}

		var controlPoints = generateControlPoints(this.radius, 4, 5);
		console.log(controlPoints);

		var degree1 = 3;
		var degree2 = 2;
		var knots1 = [0, 0, 0, 0, 1, 1, 1, 1];
		var knots2 = [0, 0, 0, 1, 1, 2, 2, 2];
		var nurbsSurface = new THREE.NURBSSurface(degree1, degree2, knots1, knots2, controlPoints);
	
		console.log(nurbsSurface.getPoint(10, 10));


		this.spoonGeom = new THREE.ParametricGeometry(function(u, v) {
			return nurbsSurface.getPoint(u, v);
		}, 20, 20 );

		this.spoonGeom.applyMatrix((new THREE.Matrix4()).makeRotationY(Math.PI/2));
		this.spoonVertices = this.spoonGeom.vertices.map(function(v){return v.clone()});
	},

	addModel : function(){
		this.scene.add(this.pack);
	},

	removeModel : function(){
		this.scene.remove(this.pack);
	},

	updateVertices : function(){
		_this = this;
		(this.strawGeom != null) && (this.strawGeom.verticesNeedUpdate = true);

		this.vertices.applyFunc(function(){
			this.object.set(0, 0, 0);
			this.index.index[0] == 0 && this.object.add(new THREE.Vector3(-_this.length/2, 0, 0));
			this.index.index[0] == 1 && this.object.add(new THREE.Vector3(_this.length/2, 0, 0));
			this.object.add(new THREE.Vector3(0, 0, _this.radius));
			this.object.applyAxisAngle(new THREE.Vector3(1, 0, 0),
									2*Math.PI*this.index.index[1]/_this.resolution);
		})
	},

	updateSpoonGeom : function(){
		for(i = 0; i < this.spoonVertices.length; i++){
			this.spoonGeom.verticesNeedUpdate = true;
			this.spoonGeom.vertices[i].copy(this.spoonVertices[i]);
			this.spoonGeom.vertices[i].add(new THREE.Vector3(this.length/2, 0, 0));
		}
	},

	updateLength : function(length){
		this.length = length;
		console.log('called');
		this.updateVertices();
		this.updateSpoonGeom();
	},

	updateRadius : function(radius){
		this.radius = radius;
		this.updateVertices();
		this.updateSpoonGeom();
	}
}