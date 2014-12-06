Tautology.Matrix = function (x, y){
	this.matrix = [];
	for(var i = 0; i < x; i++){
		this.matrix.push([]);
		for(var j = 0; j < y; j++){
			this.matrix[i].push(new THREE.Vector3(0, 0, 0));
		}
	}
}

Tautology.Matrix.prototype = {
	constructor : Tautology.Matrix,

	
}