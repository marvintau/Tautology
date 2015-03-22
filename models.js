var material = {
	mainType: 'phong',
	opacity : {val: 0.5, min:0., max:1., name: '透明度', type: 'slider'}
}

var PlainStraw = {};

PlainStraw.param = {
	length : {min:55, max:65, val:55, name : '管身长度', type: 'slider'},
	radius: {min: 2, max:4, val:3, name: '吸管半径', type: 'slider'}
}

PlainStraw.shape = [2, 60];

PlainStraw.ratio = function(param){
	this.set(param.length.val, param.radius.val*Math.PI*2);
}

PlainStraw.regions = {
	all : ['all', 'all'],
	left : [ 0, 'all' ],
	right : [ -1, 'all']
};

PlainStraw.manuever = [
	{
		command : 'tran',
		region : 'left',
		callback : function(){
			this.v.set(this.param.length.val, 0, 0);
		}
	},
	{
		command : 'tran',
		region : 'right',
		callback : function(){
			this.v.set(-this.param.length.val, 0, 0);
		}
	},
	{
		command : 'radiate',
		region : 'all',
		dimension: 1,
		callback : function(){
			this.v.set(0, 0, this.param.radius.val);
			this.axis.set(1, 0, 0);
		}
	},
	{
		command : 'rot',
		region : 'all',
		callback : function () {
			this.r.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
		}
	},

	{
		command : 'uniformRemap',
		region : 'all',
		dimension : 1,
		callback : function () {
		}
	},
	{
		command : 'uniformRemap',
		region : 'all',
		dimension : 0,
		callback : function () {
		}
	}

];


var BendyStraw = {};

// Adjustable parameters should include the min/max value and
// current value that modified by slider. The parameters that
// directly defined by user should be mentioned at first.
BendyStraw.param = {
	bellowLength: {min:0.75, max:1.5, val:0.8, name: '弯折长度', type: 'slider'},
	radius: {min: 2, max:4, val:3, name: '吸管半径', type: 'slider'},
	stubLength : {min:10, max:20, val:10, name : '管嘴长度', type: 'slider'},
	bodyLength : {min:55, max:75, val:65, name : '管身长度', type: 'slider'},
	lengthAngle: {min:0, max: Math.PI/50, val:Math.PI/80, name : '弯折角度', type: 'slider'}
};

BendyStraw.shape = [23, 60];

BendyStraw.regions = {
	all : ['all', 'all'],
	stub : [ 0, 'all' ],
	body : [ -1, 'all'],
	ridge : [[2, -2, 2], 'all']
};

BendyStraw.ratio = function(param){
	this.set(param.bodyLength.val+param.bellowLength*22+param.stubLength.val, param.radius.val*Math.PI*2);
}

BendyStraw.manuever = [
	{
		command : 'tran',
		region : 'stub',
		callback : function(){
			this.v.set(this.param.stubLength.val, 0, 0);
		}
	},
	{
		command : 'tran',
		region : 'body',
		callback : function(){
			this.v.set(-this.param.bodyLength.val, 0, 0);
		}
	},
	{
		command : 'tran',
		region : 'ridge',
		callback : function(){
			this.v.set(-0.8, 0, 0.5);
		}
	},
	{
		command : 'radiate',
		region : 'all',
		dimension: 1,
		callback : function(){
			this.v.set(0, 0, this.param.radius.val);
			this.axis.set(1, 0, 0);
		}
	},
	{
		command : 'bend',
		region : 'all',
		dimension : 0,
		callback : function () {
			this.bendAxis.set(0, 0, 1);
			this.feed.set(-this.param.bellowLength.val, 0, 0);
			this.matrices[0].makeRotationAxis(this.bendAxis, 2*this.param.lengthAngle.val) ;
			this.matrices[0].setPosition(this.feed);
		}
	},
	{
		command : 'uniformRemap',
		region : 'all',
		dimension : 1,
		callback : function () {
		}
	},
	{
		command : 'remap',
		region : 'all',
		dimension : 0,
		callback : function () {
			this.stepArray.constUpdate(this.param.bellowLength.val);
			this.stepArray[1] = this.param.stubLength.val;
			this.stepArray[this.shape[this.dim]-1] = this.param.bodyLength.val;
			this.stepArray.accumUpdate();
			this.stepArray.normalize();
		}
	},
	{
		command : 'rot',
		region : 'all',
		callback : function () {
			this.r.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI/2);
		}
	},
	{
		command : 'rot',
		region : 'all',
		callback : function () {
			this.r.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
		}
	},
	{
		command : 'tran',
		region : 'all',
		callback : function(){
			this.v.set(-30, 0, 0);
		}
	},
];

var models = {
	PlainStraw : {name : '直吸管', model: PlainStraw},
	BendyStraw : {name : '弯吸管', model : BendyStraw}
};