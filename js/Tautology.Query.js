Tautology.Query = function(){
	this.queryTable = [];
	this.matcher = null;
}

Tautology.Query.prototype = {
	constructor : Tautology.Query,

	register : function(condFunc, checkFunc){
		with ({table : this.queryTable}){
			table.push({cond: condFunc, check: checkFunc});
			if (table.length == 1){
				this.matcher = function(index, query){
					return table[0].cond(query) && table[0].check(index, query);
				}.bind(this);
			} else {
				this.matcher = function(index, query){
					for(var i = 0; i < table.length; i++){
						if(table[i].cond(query) && table[i].check(index, query)){
							return true;
						}
					}
					return false;
				}
			}		
		}
	},

	match : function(indexArray, queryArray){

		var outcome = true;
		if(indexArray.length == queryArray.length){
			for(var i = 0; i < indexArray.length; i++){
				outcome = outcome && this.matcher(indexArray[i], queryArray[i]);
			}
		}
		return outcome;
	}
}