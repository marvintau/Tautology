TauArray = function(){
	this.array = {};
	this.dim = [];
	this.proto = null;
	this.matchers = [];
}

TauArray.prototype = {
	constructor : TauArray,

	init : function(array){
		if(array.length != 0){
			this.dim = [array.length];
			this.proto = array[0].prototype;
			for(var i = 0; i < array.length; i++){
				this.array[i+""] = array[i];
			}	
		}
		
	},

	dup : function(times, cloneMethod, eraseMethod){
		(cloneMethod != undefined) && (this.proto.cloneMethod = cloneMethod);
		(cloneMethod != undefined) && (this.proto.eraseMethod = eraseMethod);

		// Step 1. Modify the dimensions.
		this.dim = [times].concat(this.dim);

		// Step 2. Create a new array with objects duplicated, if necessary
		var newArray = {};
		if( cloneMethod != undefined){
			for(var time = 0; time < times; time++){
				for (ith in this.array){
					newArray[time+","+ith] = this.array[ith].cloneMethod();
				}
			}	
		} else {
			for(var time = 0; time < times; time++){
				for (ith in this.array){
					newArray[time+","+ith] = this.array[ith];
				}
			}	
		}

		// Step 3. Dispose original objects in original array, if necessary
		if( eraseMethod != undefined){
			for (ith in this.array){
				this.array[ith].eraseMethod();
			}
		}
		this.array = {};

		// Step 4. finally, assign array with new array.
		this.array = newArray;
	}

	registerQuery : function(queryRegex, queryFunc){
		this.matchers.push({query:queryRegex, func:queryFunc});
	}

	applyFunc : function(queryString, func){
		var queryStrings = queryString.split(",");
		for (var in this.array){
			if()
		}
	}

}