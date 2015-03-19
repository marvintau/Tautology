draw = new UI.Two(BendyStraw.canvasName);

model = new Tautology.Model(BendyStraw,draw.canvas);

three = new UI.Three(BendyStraw.demoName);

// var addCollpsableFolder = function()

var addColorPicker = function(){

}

var addSlider = function(containerID, changedParam, who_updates){
	$('<li>').appendTo($('#'+containerID)).append(
        '<div class="input-group input-group-html5">'+
            '<span class="input-group-addon">'+changedParam.name+'</span>'+
            '<span class="input-group-addon addon-range">'+
            '<input type="range" id="'+changedParam.name+'-range" name="'+changedParam.name+'-range" min="'+changedParam.min*2000+'" max="'+changedParam.max*2000+'" value="'+changedParam.val*2000+'"></span>'+
            '<input type="text" id="'+changedParam.name+'-text" class="form-control" name="'+changedParam.name+'-text">'+
        '</div>');

    $('#'+changedParam.name+'-text').val($('#'+changedParam.name+'-range').val()/2000);

    $('#'+changedParam.name+'-text').on('change', function(){
        $('#'+changedParam.name+'-range').val(this.value*2000);
        who_updates.update();
    })

    $('#'+changedParam.name+'-range').on('input change', function(){
        $('#'+changedParam.name+'-text').val(this.value/2000);
        changedParam.val = this.value/2000;
        who_updates.update();
    })
}

var addSliders = function(containerID, params, who_updates){
	Object.keys(params)
		.filter(function(p){return params[p]['val']})
		.forEach(function(p){console.log(params[p]); addSlider(containerID, params[p], who_updates)});
}


model.updateScene(three.scene);

addSliders('parameters', model.geom.param, model.geom);
addSliders('parameters', model.material.param, model.material);
