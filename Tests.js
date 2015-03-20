draw = new UI.Two('two-viewport');
three = new UI.Three('three-viewport');

modelManager = new Tautology.ModelManager(models, material, draw.canvas);

modelManager.update(three.scene);

var modelSelector = function(containerID, modifierContainerID, models, who_reinits){
    $('<li>').appendTo($('#'+containerID)).append($('<div id="model-selector" class="btn-group" data-toggle="buttons"></div>'));
    Object.keys(models).forEach(function(key){
        $('<label id='+ key +' class="btn btn-default">')
            .appendTo($('#model-selector'))
            .append($('<input type="radio" autocomplete="off">'))
            .append($('<span>'+models[key].name+'</span>'));

        $('#'+key).on('click', function(){
            modelManager.currentModelKey = key;
            modelManager.update(three.scene);
            console.log(modelManager.models[key].geom.param);
            $('#'+modifierContainerID).empty();
            addModifiers(modifierContainerID, modelManager.models[key].geom.param, modelManager.models[key].geom);
            addModifiers(modifierContainerID, modelManager.material.param, modelManager.material);
        });

    });

}

var picker = function(containerID, changedParam, who_updates){
    $('<li>').appendTo($('#'+containerID)).append($('<button id='+changedParam.name+'-color href=# class=btn btn-default>'+changedParam.name+'</button>'));
    $('#'+changedParam.name+'-color').colorPicker({
        colorformat : '0x',
        alignment : 'br',
        onSelect : function(ui, color){
            changedParam.val = color;
            who_updates.update();
        }
    });
}

var slider = function(containerID, changedParam, who_updates){
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
        changedParam.val = this.value;
        who_updates.update();
    })

    $('#'+changedParam.name+'-range').on('input change', function(){
        $('#'+changedParam.name+'-text').val(this.value/2000);
        changedParam.val = this.value/2000;
        who_updates.update();
    })
}

var addModifiers = function(containerID, params, who_updates){
    
	Object.keys(params)
		.forEach(function(p){
            if(params[p].type)
                this[params[p].type](containerID, params[p], who_updates);
        });
}

modelSelector('type-list', 'parameters', models);
