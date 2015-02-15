Tautology.Point = function(){
	this.vec = new THREE.Vector3();
	this.tex = new THREE.Vector2();
	this.mad = false;
}

Tautology.Point.prototype.constructor = Tautology.Point;

Tautology.Point.prototype.setVec = function(x, y, z){
	this.vec.set(x, y, z);
}

Tautology.Point.prototype.setTex = function(x, y){
	this.tex.set(x, y);
}

Tautology.Point.prototype.trans = function(v){
	this.vec.add(v);
}

Tautology.Point.prototype.rot = function(v, a){
	this.vec.applyAxisAngle(v, a);
}

Tautology.Point.prototype.del = function(){
	this.mad = true;
}