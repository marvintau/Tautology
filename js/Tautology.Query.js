// The query class should consist of method about verifying a dimension of
// an index. Since the query array is usually changing, there is no need to
// store it. However some of the queries over a particular dimension are
// freuquently used, like even, odd, or don't-care. The query class specifies
// the procedure of matching between index array and query array, and the
// detailed matching criteria are specified by user.


Tautology.Query = function(){
	this.queryTable = [];
}

Tautology.Query.prototype = {
	constructor : Tautology.Query,

	register : function(condFunc, checkFunc){
		with ({table : this.queryTable}){
			table.push({cond: condFunc, check: checkFunc});
		}
	}
}