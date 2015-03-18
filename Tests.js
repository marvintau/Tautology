draw = new UI.Two(BendyStraw.canvasName);

model = new Tautology.Model(BendyStraw,draw.canvas);

three = new UI.Three(BendyStraw.demoName);

// var addCollpsableFolder = function()


var addSlider = function(key, params, containerID, who_updates, method){
	$('<li>').appendTo($('#'+containerID)).append(
        '<div class="input-group input-group-html5">'+
            '<span class="input-group-addon">'+params[key].name+'</span>'+
            '<span class="input-group-addon addon-range">'+
            '<input type="range" id="'+key+'-range" name="'+key+'-range" min="'+params[key].min*2000+'" max="'+params[key].max*2000+'"></span>'+
            '<input type="text" id="'+key+'-text" class="form-control" name="'+key+'-text">'+
        '</div>');

    $('#'+key+'-text').val($('#'+key+'-range').val()/2000);
    $('#'+key+'-text').on('change', function(){

        $('#'+key+'-range').val(this.value*2000);
        who_updates.update();
    })

    $('#'+key+'-range').on('input change', function(){
        $('#'+key+'-text').val(this.value/2000);
        params[key].val = this.value/2000;
        // console.log(who_updates['init']);
        who_updates.update();
    })
}

var addSliders = function(params, id, who_updates){
	Object.keys(params)
		.filter(function(p){console.log(params[p]); return params[p]['val']})
		.forEach(function(p){addSlider(p, params, id, who_updates)});
}


model.updateScene(three.scene);

// addSliders(model.geom.param, 'parameters', model.geom);
addSliders(model.material.param, 'parameters', model.material, 'update');
