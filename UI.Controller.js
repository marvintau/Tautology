UI.Controller = function(models, material){
	this.models = models;
	this.material = material;

	this.two = new UI.Two('two-viewport');
	this.three = new UI.Three('three-viewport');

	this.modelManager = new Tautology.ModelManager(this.models, this.material, this.two.canvas);

	this.modelManager.update((Object.keys(this.models))[0], this.three.scene);

	this.modelSelector('type-list', 'parameters');

	this.canvasEditor('tools', this.two);
}

UI.Controller.prototype.constructor = UI.Controller;

UI.Controller.prototype.modelSelector = function(containerID, modifierContainerID){
    $('<li>').appendTo($('#'+containerID)).append($('<div id="model-selector" class="btn-group" data-toggle="buttons"></div>'));
    Object.keys(this.models).forEach(function(key){
        $('<label id='+ key +' class="btn btn-default">')
            .appendTo($('#model-selector'))
            .append($('<input type="radio" autocomplete="off">'))
            .append($('<span>'+models[key].name+'</span>'));

        $('#'+key).on('click', function(){
            this.modelManager.update(key, this.three.scene);

            $('#'+modifierContainerID).empty();

            this.addModifiers(modifierContainerID, this.models[key].model.param, this.modelManager.models[key].geom);
            this.addModifiers(modifierContainerID, this.material, this.modelManager.material);
        }.bind(this));
    }.bind(this));
}

UI.Controller.prototype.picker = function(name, containerID, func){
    $('<li>').appendTo($('#'+containerID)).append($('<button id='+name+'-color href=# class="btn btn-default">'+name+'</button>'));
    $('#'+name+'-color').colorPicker({
        colorformat : 'rgba',
        alignment : 'br',
        onSelect : func
    });
}

UI.Controller.prototype.modal = function(param){
    $('<li>').appendTo('#'+param.container)
        .append($('<button type="button" class="btn btn-default" data-toggle="modal" data-target="#'+param.id+'">').text(param.buttonText));

    $('body').append(
        $('<div id="'+param.id+'" class="modal fade" tabindex="-1" role="dialog">').append(
            $('<div class="modal-dialog modal-lg">').append(
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                        '<h4 class="modal-title" id="myLargeModalLabel">'+param.title+'</h4>'+
                    '</div>'+
                    '<div id="'+param.id+'" class="modal-body">'+
                    '</div>'+
                '</div>'
            )
        )
    );

    $('#'+param.id+'.modal-body').append(param.content);
}

UI.Controller.prototype.slider = function(containerID, changedParam, whoever_updates){
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
        whoever_updates.update();
    })

    $('#'+changedParam.name+'-range').on('input change', function(){
        $('#'+changedParam.name+'-text').val(this.value/2000);
        changedParam.val = this.value/2000;
        whoever_updates.update();
    })
}

UI.Controller.prototype.addModifiers = function(containerID, params, whoever_updates){
	Object.keys(params).forEach(function(p){
        if(params[p].type)
        	this[params[p].type](containerID, params[p], whoever_updates);
    }.bind(this));
}

UI.Controller.prototype.insertImage = function(containerID){
    this.modal({
        container : containerID,
        id : 'gallery',
        buttonText : '插點图片？',
        title: '图片都在这儿了',
        content : $(
            '<a href=# class="select"><img src="./images/126543l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/128618l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/136024l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/127745l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/132919l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/133976l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/126347l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/128638l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/130091l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/132687l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/128665l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/132899l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/132882l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/132729l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/132852l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/129980l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/129542l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/137747l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/129859l.jpg"></a>'+
            '<a href=# class="select"><img src="./images/131406l.jpg"></a>'
        )
    })
	
	$('.select').on('click', function(e){
		this.two.addImage(e.target.getAttribute('src'));
        $('#gallery').modal('toggle');
	}.bind(this))
}

UI.Controller.prototype.insertText = function(containerID){
    this.modal({
        container : containerID,
        id : 'text',
        buttonText : '插點文字？',
        title: '想個合適的廣告語吧'
    })
}

UI.Controller.prototype.insertPattern = function(containerID){
    this.modal({
        container : containerID,
        id : 'pattern',
        buttonText : '插點图案？',
        title: '花花绿绿的多好看～'
    })

}


UI.Controller.prototype.canvasEditor = function(containerID){
    this.picker('吸管儿底色', containerID, function(ui, color){
        this.two.canvas.backgroundColor = color;
        this.two.canvas.renderAll();
    }.bind(this));

    this.insertImage(containerID);
    this.insertText(containerID);
    this.insertPattern(containerID);
}
