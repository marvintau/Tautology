param = {
	shape:function(){return [10, 10];},
	cons:function(){return Tautology.Point;}
};

codes = [{
		func: function(){
			this.object.vec.add(new THREE.Vector3(1, 0, 0));
		}
	}
];

model = new Tautology.Model(param, codes);
// model.eval();
// console.log(model.array.faces);