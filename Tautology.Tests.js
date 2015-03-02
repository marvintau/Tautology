var param = {
	// Adjustable parameters should include the min/max value and
	// current value that modified by slider.
	radius: {min: 8, max:12, val:10},
	bodyLength : {min:55, max:75, val:55},
	unitTransLength : {min:0.5, max:1.2, val: 0.7},

	// Define the shape of the vertex matrix, make sure to define
	// the getter "shape".
	bodyResolution: 1,
	neckResolution: 10,
	spoonResolution : 27,
	circumResolution: 30,
	
	get shape() {
		return [(this.bodyResolution+this.spoonResolution + 1),
		this.circumResolution + 1];
	},

	// The constants that derived from the adjustable parameters
	// yet not accompanied with vertex index should be defined as
	// getters.
	get trans() {
		return new THREE.Vector3(0, 2*Math.sin(Math.PI/this.circumResolution)*this.radius.val, 0);
	},

}
var code = function(param, array){


	for (var i = this.length - 1; i >= 0; i--) {
		this[i].set(0, 0, 0);
		if (array[i][0]== 0)
			this[i].add(new THREE.Vector3(-param.bodyLength.val, 0, 0));
		else
			this[i].add(new THREE.Vector3(param.unitTransLength.val*array[i][0], 0, 0));

		this[i].roll((param.circumResolution/2) - array[i][1]+1, param.transRollMatrixInversed);

	};
}

geometry = new Tautology.Geometry(param1, code1);

var addSlider = function(parameter, params){
	$('<input type="range">').appendTo($('body'))
		.attr({
			id: parameter,
			min:params[parameter]['min']*2000,
			max:params[parameter]['max']*2000,
			value:params[parameter]['val']*2000
		}).on('input change', function(e){
			params[parameter]['val'] = $(this).val()/2000;
			geometry.update();
		});
}

var addSliders = function(params){
	Object.keys(params)
		.filter(function(p){return params[p]['val']})
		.forEach(function(p){addSlider(p, params)});
}

three = new Tautology.Three();
three.init();
three.updateScene();

addSliders(param1);