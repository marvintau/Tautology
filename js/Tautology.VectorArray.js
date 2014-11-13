Tautology.VectorArray = function(scene){
	this.array = new Tautology.Array();
	this.query = new Tautology.Query();

	this.scene = scene;
	this.geom = new THREE.Geometry();
	this.geom.verticesNeedsUpdate = true;
	this.cloud = new THREE.PointCloud(this.geom);
	this.scene.add(this.cloud);
	
	this.update = function(){
		var vertices_array = this.array.elems.map(function(elem){return elem.object});
		this.geom.dispose();
		this.cloud.remove(this.geom);
		this.scene.remove(this.cloud);
		this.geom = new THREE.Geometry();
		this.geom.vertices = vertices_array;
		this.cloud = new THREE.PointCloud(this.geom);
		this.scene.add(this.cloud);
		
		// this.cloud = new THREE.Point
	}
}

Tautology.VectorArray.prototype ={
	constructor : Tautology.VectorArray,
	init : function(array){
		this.array.init(array, this.query);
		this.update();
	},
	dup : function(ntimes){
		this.array.dup(ntimes, THREE.Vector3.prototype.clone);
		this.update();
	},
	translate : function(vec, patt){
		this.array.applyFunc(function(){this.object.add(vec);}, patt);
		this.update();
	},

	rotate: function(vec, angle){
		var normal_vec = vec.clone(),
			shape = this.array.shape;
		normal_vec.normalize();

		this.array.applyFunc(function(){this.object.applyAxisAngle(normal_vec, angle);}, patt);
		this.update();

	},

	translateStepwise : function(vec, step){
		this.dup(step+1);
		this.array.applyFunc(function(){
			this.object.add(vec.clone().multiplyScalar(this.index[0]/step));
		});
		this.update();
	},

	rotateStepwise : function(vec, angle, step){
		var normal_vec = vec.clone();
		normal_vec.normalize();

		this.dup(step+1);
		this.array.applyFunc(function(){
			this.object.applyAxisAngle(normal_vec, this.index[0]/step*angle);
		});
		this.update();
	},

	flatten : function(){
		this.array.flatten();
	},

	transpose : function(patt){
		this.array.transpose(patt);
	},

	partition : function(num){
		this.array.partition(num);
	},

	applyFunc : function(func, query){
		this.array.applyFunc(func, query);
	},

	output: function(){
		var shape = this.array.shape;
		console.log(shape);
		console.log(this.array.elems.map(function(elem){
			return "["+elem.index.join(",")+"] " +elem.sumIndex(shape)+ " {"+elem.object.toArray().map(function(elem){return elem.toPrecision(4)}).join(", ")+"}";
		}).join("\n"));
	}
}