Tautology.MeshGenerator = function(array){
	this.array = array;
	this.cols = this.array.shape.shape[0];
	this.rows = this.array.shape.shape[1];
	this.vertexTable = {};
}

Tautology.MeshGenerator.prototype = {
	constructor : Tautology.MeshGenerator,

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

	pushVertices : function(geom, i, j){
		for(var i = 0; i < this.cols; i++){
			for(var j = 0; j < this.rows; j++){
				geom.vertices.push(this.array.elems[this.vertexTable[i+","+j].i].object);
			}
		}
	},

	pushFace : function(geom, a, b, c){
		geom.faces.push(new THREE.Face3(a.i, b.i, c.i));
		geom.faceVertexUvs[0].push([
			new THREE.Vector2(a.tCoord.x, a.tCoord.y),
			new THREE.Vector2(b.tCoord.x, b.tCoord.y),
			new THREE.Vector2(c.tCoord.x, c.tCoord.y)
		]);
	},

	pushQuad : function(geom, i, j){
		this.pushFace(geom, this.vertexTable[i+","+j],
							this.vertexTable[(i+1)+","+j],
							this.vertexTable[i+","+(j+1)]);
		this.pushFace(geom, this.vertexTable[i+","+(j+1)], 
							this.vertexTable[(i+1)+","+j],
							this.vertexTable[(i+1)+","+(j+1)]);
	},

	pushAllQuads : function(geom){
		for(var i = 0; i < this.cols - 1; i++){
			for(var j = 0; j < this.rows - 1; j++){
				this.pushQuad(geom, i, j);		
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

	generateMesh : function(){
		var geom = new THREE.Geometry();
		var packedGeom = new THREE.Object3D();

		var outside = new THREE.MeshLambertMaterial({
	    	color:0xaaaaaa,
			opacity: 0.6,
			transparent: true,
			side: THREE.FrontSide,
			map: texture,
			_needsUpdate: true
		}); 

	    var inside = new THREE.MeshLambertMaterial({
	    	color:0xaaaaaa,
			opacity: 0.6,
			transparent: true,
			side: THREE.BackSide,
			map: texture,
			_needsUpdate: true
		}); 

	    this.initIndex();
		this.getCoordinateArray();
		this.getUnifiedCoordinateArray();
		this.pushVertices(geom);
		this.pushAllQuads(geom);
		this.output();

		geom.computeFaceNormals();
		geom.computeVertexNormals();
		packedGeom.add(new THREE.Mesh(geom, outside));
		packedGeom.add(new THREE.Mesh(geom, inside));

		return packedGeom;

	}


}