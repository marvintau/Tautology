/**
 * Canvas integrates the styling and some interactive operation on the 2D drawing area 
 * @param {} divElementID
 */
Tautology.Canvas = function(elementName, width, height){
	this.patterns = {};

	$('#'+elementName).attr({'width': width, 'height': height}).css({'width':width, 'height':height});

	this.canvas = new fabric.Canvas(elementName , {
		'width' : width,
		'height': height
	});


	this.canvas.setBackgroundColor('#f0f0f0');

	this.canvas.add(new fabric.Circle({
		radius: 20, fill: 'green', left: 100, top: 100
	}));

	// this.makePatterns();


};

Tautology.Canvas.prototype.constructor = Tautology.Canvas;

/**
 * resize the canvas according to the resizing of geometric model 
 * @param  {Number} width
 * @param  {Number} height
 */
Tautology.Canvas.prototype.resize = function(width, height){
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);

    var c = this.canvas.getElement();
    c.setAttribute('width', width*window.devicePixelRatio);
    c.setAttribute('height', height*window.devicePixelRatio);
    c.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);

	this.canvas.backgroundColor = 'rgba(255,255,255, 1)';

	$('.vRule').css({'height': height + 'px'});

	this.canvas.renderAll();

};

/**
 * resize width individually
 * @param  {Number} width
 */
Tautology.Canvas.prototype.resizeWidth = function(width){
	this.canvas.setWidth(width);
	var c = this.canvas.getElement();
	c.setAttribute('width', width*window.devicePixelRatio);
	c.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);		
};

/**
 * resize height individually
 * @param  {Number} height
 */
Tautology.Canvas.prototype.resizeHeight = function(height){
	this.canvas.setHeight(height);
	var c = this.canvas.getElement();
	c.setAttribute('width', width*window.devicePixelRatio);
	c.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);		
};


/**
 * add image to canvas
 * @param {String} url
 */
Tautology.Canvas.prototype.addImage = function(url){
    fabric.Image.fromURL(url, function(img) {
	    if(img.height > this.canvas.height){
	        img.scale(img.height/this.canvas.height * 0.1);
	    }
	    img.on('selected', function(e){
	    	console.log(this);
	    })
	    this.canvas.add(img);
    }.bind(this)); 
};

/**
 * Add text to canvas
 * @param {String} text to be input
 * @param {Array} style a list of styles regarding text
 */
Tautology.Canvas.prototype.addText = function(text, style, kerning){
	var style_str = style.split(' ');
	if (text.length != 0){
		var textArray = text.split('').map(function(c){
			return new fabric.Text(c, {
				left: 0,
				top: 100,
				fontFamily : style_str[0],
				fontWeight : style_str[1]
			});
		})

		for(i = 1; i < text.length; i++){
			textArray[i].left += textArray[i-1].left + textArray[i-1].getWidth() + kerning;
		}

		this.canvas.add(new fabric.Group(textArray, {left:100}));
	}
};

/**
 * create patterns on the canvas and further mapped on the 3D model
 * @return {[type]}
 */
Tautology.Canvas.prototype.makePatterns = function(){
	var dotList = [];
		
	for(var i = 0; i < Math.floor($('#viewContainer').width()/50); i++){
		for(var j = 0; j < Math.floor($('#viewContainer').height()/50); j++){
			dotList.push(new fabric.Circle({
				radius: 10,
				fill: '#000',
				left : i * 50,
				top : j * 50
			}));

			dotList.push(new fabric.Circle({
				radius: 10,
				fill: '#000',
				left : i * 50 + 25,
				top : j * 50 + 25
			}));

		}
	}
	this.patterns['dots'] = new fabric.Group(dotList, {
		left:0,
		top: 0,
		label:'pattern', 
		selectable: false
	});

	var stripesList = [];
	for(var i = 0; i < Math.floor($('#viewContainer').width()/40) + 50; i++){
		stripesList.push(new fabric.Rect({
			fill: '#000',
			width: 32,
			height : 1000,
			left : i * 80 - 400,
			top : 0,
			angle : 45
		}));
	}
	this.patterns['stripes'] = new fabric.Group(stripesList, {
		left:-540,
		top: -140,
		label:'pattern',
		selectable: false
	});
};

/**
 * update pattern
 * @param  {Number} pattern pattern index
 */
Tautology.Canvas.prototype.updatePattern = function(pattern){
	this.canvas.add(this.patterns[pattern]);
};

/**
 * remove selected object from the canvas
 */
Tautology.Canvas.prototype.removeSelectedObject = function(){
    if(this.canvas.getActiveObject() == null){
        this.canvas.getActiveGroup().forEachObject(function(o){ this.canvas.remove(o) });
        this.canvas.discardActiveGroup().renderAll();
    } else if(this.canvas.getActiveObject() != null){
        this.canvas.remove(this.canvas.getActiveObject());
        this.canvas.discardActiveObject().renderAll();
    }
};

/**
 * remove everything
 */
Tautology.Canvas.prototype.removeAll = function(){
	this.canvas.clear();
};
