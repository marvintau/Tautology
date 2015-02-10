param = {
	shape:function(){return [10, 10];},
	cons:function(){return Tautology.Point;}
};

parts = {
	first : function(){
		return this.index[0] ==1 && this.object.vec;
	}
};

codes = [{
		part:"first",
	
		func: function(){
			console.log(this.index);
			this.object.vec.add(new THREE.Vector3(1, 0, 0));
			console.log(this.object.vec);
		}
	}
];

model = new Tautology.Model(param, parts, codes);
model.eval();