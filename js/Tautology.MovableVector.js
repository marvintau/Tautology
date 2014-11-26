// The Tautological MovableVector is design for controllable geometries.
// MovableVector exports the parameters of the vectors, which makes the
// vector able to be controlled from the outside interactively.

// By registering the operations over the vector (adding the operations
// into the array), a function should be generated that represents the
// overall effect over the vector. This function will be exported 

Tautology.MovableVector3 = function(x, y, z){
	THREE.Vector3.call(this, x, y, z);
	this.operations = [];
	this.move = null;
}

Tautology.MovableVector.prototype = {
	constructor : Tautology.MovableVector;
}