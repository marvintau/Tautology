Tautology.MeshGeometry = function(array, left, width, top, height){

	this.left = left;
	this.top = top;
	this.width = width;
	this.height = height;

	this.array = array;
	this.geom = new THREE.Geometry();

	this.cols = this.array.shape.shape[0];
	this.rows = this.array.shape.shape[1];
	this.vertexTable = {};
}

Tautology.MeshGeometry.prototype = {
	constructor : Tautology.MeshGeometry,

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

	generate : function(i, j){

		dX = (j != 0) && this.distX(this.array.elems, i, j) || 0;
		dY = (i != 0) && this.distY(this.array.elems, i, j) || 0;

		this.vertexTable[i+","+j].x = (j != 0) && dX + this.vertexTable[i+","+(j-1)].x || 0;
		this.vertexTable[i+","+j].y = (i != 0) && dY + this.vertexTable[(i-1)+","+j].y || 0;
	},

	generateArray : function(){
		for(var i = 0; i < this.cols; i++){
			for(var j = 0; j < this.rows; j++){
				this.generate(i, j);
			}						
		}
	},

	getUnifiedCoordinateArray : function(){
		for(var i = 0; i < this.cols; i++){
			for(var j = 0; j < this.rows; j++){
				this.vertexTable[i+","+j].x /= this.vertexTable[i+","+(this.rows - 1)].x;
				(this.width != undefined) && (this.vertexTable[i+","+j].x *= this.width);
				(this.left != undefined) && (this.vertexTable[i+","+j].x += this.left);
				this.vertexTable[i+","+j].y /= this.vertexTable[(this.cols - 1)+","+j].y;
				(this.height != undefined) && (this.vertexTable[i+","+j].y *= this.height);
				(this.top != undefined) && (this.vertexTable[i+","+j].x += this.top);
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
			new THREE.Vector2(a.x, a.y),
			new THREE.Vector2(b.x, b.y),
			new THREE.Vector2(c.x, c.y)
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
				s += this.vertexTable[i+","+j].x.toFixed(3)+" "+this.vertexTable[i+","+j].y.toFixed(3);
			}
			s = s +"\n";
		}
		console.log(s);
	},

	generateGeom : function(swapAxis){
		
	    this.initIndex();
		this.generateArray();
		this.getUnifiedCoordinateArray();
		this.pushVertices();
		this.pushAllQuads();
		// this.output();

		if(swapAxis){
			this.geom.faceVertexUvs[0].map(function(face){face.map(function(point){point.set(point.y, point.x);});});
		}
		this.geom.computeFaceNormals();
		this.geom.computeVertexNormals();
		this.geom.normalsNeedUpdate = true;
	},

	setVertex : function(i, j, vector){
		this.geom.verticesNeedUpdate = true;
		this.array.elems[this.vertexTable[i+","+j].i].object.copy(vector);
	}
}