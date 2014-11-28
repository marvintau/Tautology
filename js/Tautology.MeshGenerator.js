Tautology.Geometry = function(array){

	this.array = array;
	this.geom = new THREE.Geometry();

	this.cols = this.array.shape.shape[0];
	this.rows = this.array.shape.shape[1];
	this.vertexTable = {};
}

Tautology.Geometry.prototype = {
	constructor : Tautology.Geometry,

	initIndex : function(){
		for (var i = 0; i < this.array.elems.length; i++){
			this.vertexTable[this.array.elems[i].index.toLabel()] = {'i':i};
		}
	},

	distX : function(elems, i, j){
		var o1 = elems[this.vertexTable[i+","+j].i].object,
			o2 = elems[this.vertexTable[i+","+(j-1)].i].object;
		return o1.distanceTo(o2);
	},

	distY : function(elems, i, j){
		var o1 = elems[this.vertexTable[i+","+j].i].object,
			o2 = elems[this.vertexTable[(i-1)+","+j].i].object;
		return o1.distanceTo(o2);
	},

	getCoordinate : function(i, j){

		dX = (j != 0) && this.distX(this.array.elems, i, j) || 0;
		dY = (i != 0) && this.distY(this.array.elems, i, j) || 0;

		this.vertexTable[i+","+j].tCoord = {
			x:(j != 0) && dX + this.vertexTable[i+","+(j-1)].tCoord.x || 0,
			y:(i != 0) && dY + this.vertexTable[(i-1)+","+j].tCoord.y || 0
		}
	},

	getCoordinateArray : function(){
		for(var i = 0; i < this.cols; i++){
			for(var j = 0; j < this.rows; j++){
				this.getCoordinate(i, j);
			}						
		}
	},

	getUnifiedCoordinateArray : function(){
		for(var i = 0; i < this.cols; i++){
			for(var j = 0; j < this.rows; j++){
				this.vertexTable[i+","+j].tCoord.x /= this.vertexTable[i+","+(this.rows - 1)].tCoord.x;
				this.vertexTable[i+","+j].tCoord.y /= this.vertexTable[(this.cols - 1)+","+j].tCoord.y;
			}						
		}
	},

	pushVertices : function(i, j){
		for(var i = 0; i < this.cols; i++){
			for(var j = 0; j < this.rows; j++){
				this.geom.vertices.push(this.array.elems[this.vertexTable[i+","+j].i].object);
			}
		}
	},

	pushFace : function(a, b, c){
		this.geom.faces.push(new THREE.Face3(a.i, b.i, c.i));
		this.geom.faceVertexUvs[0].push([
			new THREE.Vector2(a.tCoord.x, a.tCoord.y),
			new THREE.Vector2(b.tCoord.x, b.tCoord.y),
			new THREE.Vector2(c.tCoord.x, c.tCoord.y)
		]);
	},

	pushQuad : function(i, j){
		this.pushFace( 	this.vertexTable[i+","+j],
						this.vertexTable[(i+1)+","+j],
						this.vertexTable[i+","+(j+1)]);
		this.pushFace(	this.vertexTable[i+","+(j+1)], 
						this.vertexTable[(i+1)+","+j],
						this.vertexTable[(i+1)+","+(j+1)]);
	},

	pushAllQuads : function(){
		for(var i = 0; i < this.cols - 1; i++){
			for(var j = 0; j < this.rows - 1; j++){
				this.pushQuad(i, j);		
			}
		}

	},

	output : function(){
		s = "";
		last = (this.cols-1)+","+(this.rows-1);
		for(var i = 0; i < this.cols; i++){
			for(var j = 0; j < this.rows; j++){
				s += ((j==0)?"":" ")+"["+i+","+j+"] ";
				s += this.vertexTable[i+","+j].i+" "+Array((this.vertexTable[last].i+"").length - (this.vertexTable[i+","+j].i+"").length+1).join(" ");
				s += this.vertexTable[i+","+j].tCoord.x.toFixed(3)+" "+this.vertexTable[i+","+j].tCoord.y.toFixed(3);
			}
			s = s +"\n";
		}
		console.log(s);
	},

	generateGeom : function(){
		
	    this.initIndex();
		this.getCoordinateArray();
		this.getUnifiedCoordinateArray();
		this.pushVertices();
		this.pushAllQuads();
		this.output();

		this.geom.computeFaceNormals();
		this.geom.computeVertexNormals();
		// goem.normalsNeedUpdate = true;
	},

	setVertex : function(i, j, vector){
		console.log(this.geom.vertices[this.vertexTable[i+","+j].i]);
		this.geom.verticesNeedUpdate = true;
		this.array.elems[this.vertexTable[i+","+j].i].object.copy(vector);
		console.log(this.geom.vertices[this.vertexTable[i+","+j].i]);
	}
}