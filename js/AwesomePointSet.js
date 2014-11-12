var AwesomePointSet = function(scene){
	this.array = new AwesomeArray();

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

AwesomePointSet.prototype ={
	constructor : AwesomePointSet,
	init : function(array){
		this.array.init(array);
		this.update();
	},
	dup : function(ntimes){
		this.array.dup(ntimes, THREE.Vector3.prototype.clone);
		this.update();
	},
	translate : function(vec, patt){
		this.array.apply_func(function(){this.object.add(vec)}, patt);
		this.update();
	},

	translate_dup : function(vec, step){
		this.dup(step+1);
		this.array.apply_func(function(){
			this.object.add(vec.clone().multiplyScalar(this.index[0]/step));
		});
		this.update();
	},

	rotate_dup : function(vec, angle, step){
		var normal_vec = vec.clone();
		normal_vec.normalize();

		this.dup(step+1);
		this.array.apply_func(function(){
			this.object.applyAxisAngle(normal_vec, this.index[0]/step*angle);
		});
		this.update();
	},

	rotate_existing: function(vec, angle){
		var normal_vec = vec.clone(),
			shape = this.array.shape;
		normal_vec.normalize();

		this.array.apply_func(function(){
			this.object.applyAxisAngle(normal_vec, this.index[0]/(shape[0]-1)*angle);
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

	output: function(){
		var shape = this.array.shape;
		console.log(shape);
		console.log(this.array.elems.map(function(elem){
			return "["+elem.index.join(",")+"] " +elem.sum_index(shape)+ " {"+elem.object.toArray().map(function(elem){return elem.toPrecision(4)}).join(", ")+"}";
		}).join("\n"));
	}
}