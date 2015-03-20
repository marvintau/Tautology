ui = new UI.Controller(models, material);

var modelSelector = function(containerID, modifierContainerID, models, who_reinits){
    $('<li>').appendTo($('#'+containerID)).append($('<div id="model-selector" class="btn-group" data-toggle="buttons"></div>'));
    Object.keys(models).forEach(function(key){
        $('<label id='+ key +' class="btn btn-default">')
            .appendTo($('#model-selector'))
            .append($('<input type="radio" autocomplete="off">'))
            .append($('<span>'+models[key].name+'</span>'));

        $('#'+key).on('click', function(){
            ui.modelManager.currentModelKey = key;
            ui.modelManager.update(ui.three.scene);
            console.log(ui.modelManager.models[key].geom.param);
            $('#'+modifierContainerID).empty();
            addModifiers(modifierContainerID, ui.modelManager.models[key].geom.param, ui.modelManager.models[key].geom);
            addModifiers(modifierContainerID, ui.modelManager.material.param, ui.modelManager.material);
        });

    });

}

var picker = function(name, containerID, func){
    $('<li>').appendTo($('#'+containerID)).append($('<button id='+name+'-color href=# class=btn btn-default>'+name+'</button>'));
    $('#'+name+'-color').colorPicker({
        colorformat : 'rgba',
        alignment : 'br',
        onSelect : func
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

var imageInput = function(containerID){
    $('<li>').appendTo('#'+containerID)
        .append($('<button type="button" class="btn btn-default" data-toggle="modal" data-target="#gallery">').text('插个图片？'));

    $('body').append(
        $('<div id="gallery" class="modal fade" tabindex="-1" role="dialog">').append(
            $('<div class="modal-dialog modal-lg">').append(
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
                        '<h4 class="modal-title" id="myLargeModalLabel">是的，图片们都在这里了</h4>'+
                    '</div>'+
                    '<div class="modal-body">'+
                        'Let\'s do something bad'+
                    '</div>'+
                '</div>'
            )
        )
    );
}

var canvasEditor = function(containerID, canvasUI){
    picker('吸管儿底色', containerID, function(ui, color){
        canvasUI.canvas.backgroundColor = color;
        canvasUI.canvas.renderAll();
    });

    imageInput(containerID);
}
