geometry = new Tautology.Geometry(BendyStraw.param, BendyStraw.shape, BendyStraw.regions, BendyStraw.manuever);

var addSlider = function(parameter, params){
	$('<input type="range">').appendTo($('body'))
		.attr({
			id: parameter,
			min:params[parameter]['min']*2000,
			max:params[parameter]['max']*2000,
			value:params[parameter]['val']*2000
		}).on('input change', function(e){
			params[parameter]['val'] = $(this).val()/2000;
			geometry.updateGeom();
		}).before('<br>').before(parameter);
}

var addSliders = function(params){
	Object.keys(params)
		.filter(function(p){return params[p]['val']})
		.forEach(function(p){addSlider(p, params)});
}

three = new Tautology.Three();
three.init();
three.updateScene();

addSliders(BendyStraw.param);