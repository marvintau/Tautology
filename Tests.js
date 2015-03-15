draw = new UI.Two(BendyStraw.canvasName, 1024, 256);

model = new Tautology.Model(BendyStraw,draw.canvas);

three = new UI.Three(BendyStraw.demoName, 1024, 300);


var addSlider = function(parameter, params, id){
	$('<input type="range">').appendTo($('#'+id))
		.attr({
			id: parameter,
			min:params[parameter]['min']*2000,
			max:params[parameter]['max']*2000,
			value:params[parameter]['val']*2000
		}).on('input change', function(e){
			params[parameter]['val'] = $(this).val()/2000;
			model.geom.update();
		}).before('<br>').before(parameter);
}

var addSliders = function(params, id){
	Object.keys(params)
		.filter(function(p){return params[p]['val']})
		.forEach(function(p){addSlider(p, params, id)});
}


model.updateScene(three.scene);

addSliders(BendyStraw.param.geom, 'toolbar');