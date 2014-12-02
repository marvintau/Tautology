Tautology.VectorArray = function(scene){
	this.array = new Tautology.Array();
	this.query = new Tautology.Query();
}

Tautology.VectorArray.prototype ={
	constructor : Tautology.VectorArray,
	init : function(array){
		this.array.init(array, this.query);
	},
	dup : function(ntimes){
		this.array.dup(ntimes, THREE.Vector3.prototype.clone);
	},

	translate : function(vec, patt){
		this.array.apply(function(){this.object.add(vec);}, patt);
	},

	rotate: function(vec, angle, patt){
		var normal_vec = vec.clone(),
			shape = this.array.shape;
		normal_vec.normalize();

		this.array.apply(function(){this.object.applyAxisAngle(normal_vec, angle);}, patt);

	},

	translateStepwise : function(vec, step){
		this.dup(step+1);
		this.array.apply(function(){
			this.object.add(vec.clone().multiplyScalar(this.index.index[0]/step));
		});
	},

	rotateStepwise : function(vec, angle, step){
		var normal_vec = vec.clone();
		normal_vec.normalize();

		this.dup(step+1);
		this.array.apply(function(){
			this.object.applyAxisAngle(normal_vec, this.index.index[0]/step*angle);
		});
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

		var num = function(num, precision){
			return ((num<0) ? "" : " ") + num.toFixed(precision);
		}
		console.log(this.array.elems.map(function(elem){
			var s = "["+elem.index.index.join(",")+"] " +elem.index.sum(shape);
				s += " {"+elem.object.toArray().map(function(elem){return num(elem,3)}).join(", ")+"}";
			return s;
		}).join("\n"));
	}
}

