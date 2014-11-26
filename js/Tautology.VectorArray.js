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
		console.log(this.isShowinglabel);
		this.isShowinglabel = !this.isShowinglabel;
		this.updateLabel();
	},

	//Need to validate the dimensions
	generateMesh : function(){
		var index = {};
		var geom = new THREE.Geometry();
		var packedGeom = new THREE.Object3D();

		var findTextureCoords = function(){

			var dX, dY;

			var distX = function(elems, i, j){
				var o1 = elems[index[i+","+j].i].object,
					o2 = elems[index[i+","+(j-1)].i].object;
				return o1.distanceTo(o2);
			};

			var distY = function(elems, i, j){
				var o1 = elems[index[i+","+j].i].object,
					o2 = elems[index[(i-1)+","+j].i].object;
				return o1.distanceTo(o2);
			};


			var updateElems = function(elems){
				dX = (j != 0) && distX(elems, i, j) || 0;
				dY = (i != 0) && distY(elems, i, j) || 0;

				index[i+","+j].tCoord = {
					x:(j != 0) && dX + index[i+","+(j-1)].tCoord.x || 0,
					y:(i != 0) && dY + index[(i-1)+","+j].tCoord.y || 0
				}
			}

			with({elems : this.array.elems}){
				for(var i = 0; i < this.array.shape.shape[0]; i++){
					for(var j = 0; j < this.array.shape.shape[1]; j++){
						updateElems(elems);
					}						
				}

				lastX = this.array.shape.shape[0]-1;
				lastY = this.array.shape.shape[1]-1;
				for(var i = 0; i < this.array.shape.shape[0]; i++){
					for(var j = 0; j < this.array.shape.shape[1]; j++){
						index[i+","+j].tCoord.x /= index[i+","+lastY].tCoord.x;
						index[i+","+j].tCoord.y /= index[lastX+","+j].tCoord.y;
					}						
				}
			}	
			
		}.bind(this);

		var output = function(){
			s = "";
			last = (this.array.shape.shape[0]-1)+","+(this.array.shape.shape[1]-1);
			for(var i = 0; i < this.array.shape.shape[0]; i++){
				for(var j = 0; j < this.array.shape.shape[1]; j++){
					s += ((j==0)?"":" ")+"["+i+","+j+"] ";
					s += index[i+","+j].i+" "+Array((index[last].i+"").length - (index[i+","+j].i+"").length+1).join(" ");
					s += index[i+","+j].tCoord.x.toFixed(3)+" "+index[i+","+j].tCoord.y.toFixed(3);
				}
				s = s +"\n";
			}
			console.log(s);
		}.bind(this);

		for (var i = 0; i < this.array.elems.length; i++){
			index[this.array.elems[i].index.index.toString()] = {'i':i};
		}

		findTextureCoords();
		// output();

		var pushVertex = function(goem, i, j){
			geom.vertices.push(this.array.elems[index[i+","+j].i].object);
		}.bind(this);

		console.log(geom.vertices);

		var pushFace = function(geom, a, b, c, u){
			// u ? (geom.faces.push(new THREE.Face3(0, 1, 2))) : (geom.faces.push(new THREE.Face3(2, 1, 3)));
			geom.faces.push(new THREE.Face3(a.i, b.i, c.i));
			geom.faceVertexUvs[0].push([
				new THREE.Vector2(a.tCoord.x, a.tCoord.y),
				new THREE.Vector2(b.tCoord.x, b.tCoord.y),
				new THREE.Vector2(c.tCoord.x, c.tCoord.y)
				]);
		}

		var pushQuad = function(geom, i, j){
			pushFace(geom, index[i+","+j], index[(i+1)+","+j], index[i+","+(j+1)], true);
			pushFace(geom, index[i+","+(j+1)], index[(i+1)+","+j], index[(i+1)+","+(j+1)], false);
		}

		for(var i = 0; i < this.array.shape.shape[0]; i++){
			for(var j = 0; j < this.array.shape.shape[1]; j++){
				pushVertex(geom, i, j);
			}
		}

	    var m = new THREE.MeshLambertMaterial({
	    	color:0xaaaaaa,
			opacity: 0.6,
			transparent: true,
			side: THREE.DoubleSide,
			map: texture,
			_needsUpdate: true
		}); 

	    var n = new THREE.MeshLambertMaterial({
	    	color:0xaaaaaa,
			opacity: 0.6,
			transparent: true,
			side: THREE.BackSide,
			map: texture,
			_needsUpdate: true
		}); 

	    // For showing the mesh, will cause serious lag.
	 //    var l = new THREE.MeshBasicMaterial({
		//     color: 0x000000,
		//     wireframe: true
		// });


		var geom;
		for(var i = 0; i < this.array.shape.shape[0]-1; i++){
			for(var j = 0; j < this.array.shape.shape[1]-1; j++){
				pushQuad(geom, i, j);
				
			}
		}
		geom.computeFaceNormals();
		geom.computeVertexNormals();
		packedGeom.add(new THREE.Mesh(geom, m));
		packedGeom.add(new THREE.Mesh(geom, n));
		// packedGeom.add(new THREE.Mesh(geom, l));

		return packedGeom;
	}

}

