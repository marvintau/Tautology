params = {
	shape:function(){return [3, 3, 3];},
	cons:function(){return Tautology.Point;}
};

queries = {
	first : function(){
		return this.index[0] ==1 && this.object.vec;
	}
};

routines = [
	{query: 'first'}
];

model = new Tautology.Model(params, routines, queries);
model.eval();