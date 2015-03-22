UI.Controller = function(models, material){
	this.models = models;
	this.material = material;

	this.two = new UI.Two('two-viewport');
	this.three = new UI.Three('three-viewport');

	this.modelManager = new Tautology.ModelManager(this.models, this.material, this.two.canvas);

	this.modelManager.select((Object.keys(this.models))[0], this.three.scene);

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
            this.modelManager.select(key, this.three.scene);

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

UI.Controller.prototype.slider = function(param, containerID){
    $('<li>').appendTo($('#'+containerID)).append(
        '<div id="'+param.name+'" class="input-group input-group-html5">'+
            '<span class="input-group-addon">'+param.name+'</span>'+
            '<span class="input-group-addon addon-range">'+
            '<input type="range" id="'+param.name+'-range" name="'+param.name+'-range" min="'+param.min*2000+'" max="'+param.max*2000+'" value="'+param.val*2000+'"></span>'+
            '<input type="text" id="'+param.name+'-text" class="form-control" name="'+param.name+'-text" value="'+param.val+'"">'+
        '</div>');

    $('#'+param.name+'-text').on('change', function(){
        $('#'+param.name+'-range').val(this.value*2000);
    })

    $('#'+param.name+'-range').on('input change', function(){
        $('#'+param.name+'-text').val(this.value/2000);
        
    })

}

UI.Controller.prototype.paramSlider = function(containerID, changedParam, whoever_updates){

    this.slider(changedParam, containerID);

    $('#'+changedParam.name+'-text').val($('#'+changedParam.name+'-range').val()/2000);

    $('#'+changedParam.name+'-text').on('change', function(){
        changedParam.val = this.value;
        whoever_updates.update();
    })

    $('#'+changedParam.name+'-range').on('input change', function(){
        changedParam.val = this.value/2000;
        whoever_updates.update();
    })
}

UI.Controller.prototype.addModifiers = function(containerID, params, whoever_updates){
	Object.keys(params).forEach(function(p){
        if(params[p].type)
        	this.paramSlider(containerID, params[p], whoever_updates);
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
    var text = $('<form><div class="form-group">'+
                    '<textarea id="text" class="form-control"></textarea>'+
                    '</div>'+
                '</form>'
        );

    this.modal({
        container : containerID,
        id : 'text',
        buttonText : '插點文字？',
        title: '想個合適的廣告語吧',
        content : text
    });

    this.slider({
        name : '字号',
        min : 10,
        max : 30,
        val : 20
    }, 'text.modal-body');

    this.slider({
        name : '字符间距',
        min : -5,
        max : 5,
        val : 0
    }, 'text.modal-body');

    $('#字号').unwrap().wrap('<div class="form-group">');

    $('#字符间距').unwrap().wrap('<div class="form-group">');

    $('#text.modal-body').append('<button id="confirm-text" href=# class="btn btn-primary">插入文字</button>')

    $('#confirm-text').on('click', function(){
        this.two.addText($('textarea#text').val(), 'Helvetica normal', parseFloat($('#字号-text').val()), parseFloat($('#字符间距-text').val()));
        $('#text').modal('toggle');
    }.bind(this))
}

UI.Controller.prototype.insertPattern = function(containerID){
    this.modal({
        container : containerID,
        id : 'pattern',
        buttonText : '插點图案？',
        title: '花花绿绿的多好看～'
    })
}

UI.Controller.prototype.deleteButton = function(containerID){
    $('<li>').appendTo($('#'+containerID)).append($('<button id="deleteButton" href=# class="btn btn-primary">删掉点选的文字或图片</button>'));

    $('#deleteButton').on('click', function(){
        console.log('here');
        this.two.removeSelectedObject();
        this.two.canvas.renderAll();
    }.bind(this));
}



UI.Controller.prototype.canvasEditor = function(containerID){
    this.picker('吸管儿底色', containerID, function(ui, color){
        this.two.canvas.backgroundColor = color;
        this.two.canvas.renderAll();
    }.bind(this));

    this.insertImage(containerID);
    this.insertText(containerID);
    this.insertPattern(containerID);
    this.deleteButton(containerID);
}
