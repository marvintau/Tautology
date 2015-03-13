draw = new Tautology.Canvas(BendyStraw.canvasName, 512, 256);

model = new Tautology.Model(BendyStraw, draw.canvas);

three = new Tautology.Three(BendyStraw.demoName);


var addSlider = function(parameter, params){
	$('<input type="range">').appendTo($('body'))
		.attr({
			id: parameter,
			min:params[parameter]['min']*2000,
			max:params[parameter]['max']*2000,
			value:params[parameter]['val']*2000
		}).on('input change', function(e){
			params[parameter]['val'] = $(this).val()/2000;
			model.geom.updateGeom();
		}).before('<br>').before(parameter);
}

var addSliders = function(params){
	Object.keys(params)
		.filter(function(p){return params[p]['val']})
		.forEach(function(p){addSlider(p, params)});
}


model.updateScene(three.scene);

addSliders(BendyStraw.param.geom);