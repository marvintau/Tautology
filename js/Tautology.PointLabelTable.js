Tautology.PointLabelTable = function(){
	this.labelTable = [];

	this.makeLabel = function(elem){
		var fontface = "TheSans",
		var fontsize = 16;
		var bgColor  = {r:128, g:128, b:128, a:0.8}

		// var spriteAlignment = THREE.SpriteAlignment.topLeft;
			
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		ctx.font = "Bold " + fontsize + "px " + fontface;
	    
		var metrics = ctx.measureText( elem.index.toString() );
		var textWidth = metrics.width;
		
		ctx.fillStyle = "rgba(128, 128, 128, 0.8)";
		roundRect(ctx, 0, 0, textWidth, fontsize * 1.4, 6);
		
		ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
		ctx.fillText( elem.index.toString() , 0, 0);
		
		// canvas contents will be used for a texture
		var texture = new THREE.Texture(canvas) 
		texture.needsUpdate = true;

		var spriteMaterial = new THREE.SpriteMaterial( 
			{ map: texture, useScreenCoordinates: false } );
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.scale.set(100,50,1.0);
		sprite.position.set(elem.object)
		return sprite;	
	};

	this.roundRect = function(ctx, x, y, w, h, r) {
	    ctx.beginPath();
	    ctx.moveTo(x+r, y);
	    ctx.lineTo(x+w-r, y);
	    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
	    ctx.lineTo(x+w, y+h-r);
	    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
	    ctx.lineTo(x+r, y+h);
	    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
	    ctx.lineTo(x, y+r);
	    ctx.quadraticCurveTo(x, y, x+r, y);
	    ctx.closePath();
	    ctx.fill();
		ctx.stroke();   
	}

}

Tautology.PointLabelTable.prototype = {
	constructor : Tautology.PointLabelTabe,
}

