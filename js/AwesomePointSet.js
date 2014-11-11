var AwesomePointSet = function(scene){
	this.array = new AwesomeArray();

	this.scene = scene;
	this.geom = new THREE.Geometry();
	this.geom.verticesNeedsUpdate = true;
	this.cloud = new THREE.PointCloud(this.geom);
	

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
		this.dup(step);
		this.array.apply_func(function(){
			this.object.add(vec.clone().multiplyScalar(this.index[0]/(step-1)));
		});
		this.update();
	},

	flatten : function(){
		this.array.flatten();
	},

	output: function(){
		console.log(this.array.elems.map(function(elem){
			return "["+elem.index.join(",")+"] {"+elem.object.toArray().join(", ")+"}";
		}));
	}
}