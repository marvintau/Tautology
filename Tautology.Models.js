var BendyStraw = {};
	// Adjustable parameters should include the min/max value and
	// current value that modified by slider. The parameters that
	// directly defined by user should be mentioned at first.
BendyStraw.param = {};
BendyStraw.param.geom = {
	bellowLength: {min:0.75, max:1.5, val:0.8},
	radius: {min: 2, max:4, val:3},
	stubLength : {min:10, max:20, val:10},
	bodyLength : {min:45, max:55, val:45},
	lengthAngle: {min:0, max: Math.PI/50, val:Math.PI/80}
};
	// Define the shape of the vertex matrix, make sure to define
	// the getter "shape".
BendyStraw.param.material = {
	mainType: 'lambert',
	transparency: 'opaque',
	color : 0xffffff,
	opacity : {val: 0.5, min:0., max:1.}
}


BendyStraw.shape = [23, 40];

BendyStraw.regions = {
	all : ['all', 'all'],
	stub : [ -1, 'all' ],
	body : [ 0, 'all'],
	ridge : [[2, -2, 2], 'all']
};

BendyStraw.manuever = [
	{
		command : 'tran',
		region : 'stub',
		callback : function(){
			this.v.set(-this.param.stubLength.val, 0, 0);
		}
	},
	{
		command : 'tran',
		region : 'body',
		callback : function(){
			this.v.set(this.param.bodyLength.val, 0, 0);
		}
	},
	{
		command : 'tran',
		region : 'ridge',
		callback : function(){
			this.v.set(0.8, 0, 0.5);
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
	}
];
