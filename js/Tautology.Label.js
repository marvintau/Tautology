Tautology.Label = function(scene){
	this.scene = scene;
	this.labels  = [];
	this.sprites = [];
	this.isShowinglabel = true;
}

Tautology.Label.prototype = {
	constructor : Tautology.Label,

	makeSprite : function( message ){
	
		var fontface = "Helvetica";	
		var fontsize =  96;

		var roundRect = function(ctx, x, y, w, h, r) {
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
			
		var canvas = document.createElement('canvas');
			canvas.id = "sprite";
		var context = canvas.getContext('2d');
		context.font = fontsize + "px " + fontface;
	    
		// get size data (height depends only on font size)
		var metrics = context.measureText( message );
		var textWidth = metrics.width;
		var margin = 20;
		
		context.fillStyle   = "rgba(191,191,191,0.4)";
		context.strokeStyle = "rgba(191,191,191,0.4)";
		roundRect(context, 0, 0, textWidth + margin * 2, fontsize * 1.4, 16);

		context.fillStyle = "rgba(0, 0, 0, 1.0)";
		context.fillText( message, margin, fontsize);
		
		// canvas contents will be used for a texture
		var texture = new THREE.Texture(canvas) 
		texture.needsUpdate = true;

		var spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.scale.set(.6,.3,1.0);
		return sprite;	
	},

	updateLabel: function(array){
		for(var i = 0; i < this.labels.length; i++){
			delete this.labels[i].material.map.image;
			this.labels[i].material.map.dispose();
			this.labels[i].material.dispose(); 
			this.scene.remove(this.labels[i]);
		}
		this.labels = [];

		if(this.isShowinglabel){
			for(var i = 0; i < array.elems.length; i++){
				// console.log(a.array.elems[i].index);
				this.labels.push(this.makeSprite(array.elems[i].index.index.join(",")));
				this.labels[i].position.copy(array.elems[i].object);
				this.scene.add(this.labels[i]);
			}	
		}
	},

	toggleLabel: function(){
		this.isShowinglabel = !this.isShowinglabel;
		this.updateLabel();
	}


}