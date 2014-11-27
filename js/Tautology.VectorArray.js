Tautology.VectorArray = function(scene){
	this.array = new Tautology.Array();
	this.query = new Tautology.Query();

	this.scene = scene;
	this.labels = [];
	this.sprites = [];	//For recycling memory
	this.isShowinglabel = true;

	this.makeTextSprite = function( message ){
	
		var fontface = "TheSans";	
		var fontsize =  48;

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
	}

}

Tautology.VectorArray.prototype ={
	constructor : Tautology.VectorArray,
	init : function(array){
		this.array.init(array, this.query);
		this.updateLabel();
		// this.update();
	},
	dup : function(ntimes){
		this.array.dup(ntimes, THREE.Vector3.prototype.clone);
		this.updateLabel();
		// this.update();
	},

	translate : function(vec, patt){
		this.array.apply(function(){this.object.add(vec);}, patt);
		this.updateLabel();
		// this.update();
	},

	rotate: function(vec, angle, patt){
		var normal_vec = vec.clone(),
			shape = this.array.shape;
		normal_vec.normalize();

		this.array.apply(function(){this.object.applyAxisAngle(normal_vec, angle);}, patt);
		this.updateLabel();
		// this.update();

	},

	translateStepwise : function(vec, step){
		this.dup(step+1);
		this.array.apply(function(){
			this.object.add(vec.clone().multiplyScalar(this.index.index[0]/step));
		});
		this.updateLabel();
		// this.update();
	},



	rotateStepwise : function(vec, angle, step){
		var normal_vec = vec.clone();
		normal_vec.normalize();

		this.dup(step+1);
		this.array.apply(function(){
			this.object.applyAxisAngle(normal_vec, this.index.index[0]/step*angle);
		});
		this.updateLabel();
	},

	flatten : function(){
		this.array.flatten();
		this.updateLabel();
	},

	transpose : function(patt){
		this.array.transpose(patt);
		this.updateLabel();
	},

	partition : function(num){
		this.array.partition(num);
		this.updateLabel();
	},

	applyFunc : function(func, query){
		this.array.applyFunc(func, query);
		this.updateLabel();
	},

	output: function(){
		var shape = this.array.shape;

		var num = function(num, precision){
			return ((num<0) ? "" : " ") + num.toFixed(precision);
		}
		console.log(this.array.elems.map(function(elem){
			var s = "["+elem.index.index.join(",")+"] " +elem.index.sum(shape);
				s += " {"+elem.object.toArray().map(function(elem){return num(elem,3)}).join(", ")+"}";
			return s;
		}).join("\n"));
	},

	updateLabel: function(){
		for(var i = 0; i < this.labels.length; i++){
			delete this.labels[i].material.map.image;
			this.labels[i].material.map.dispose();
			this.labels[i].material.dispose(); 
			this.scene.remove(this.labels[i]);
		}
		this.labels = [];

		if(this.isShowinglabel){
			for(var i = 0; i < a.array.elems.length; i++){
				// console.log(a.array.elems[i].index);
				this.labels.push(a.makeTextSprite(a.array.elems[i].index.index.join(",")));
				this.labels[i].position.copy(a.array.elems[i].object);
				this.scene.add(this.labels[i]);
			}	
		}
	},

	toggleLabel: function(){
		this.isShowinglabel = !this.isShowinglabel;
		this.updateLabel();
	}
}

