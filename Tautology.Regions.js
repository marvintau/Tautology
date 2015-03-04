Tautology.Regions = function(specs){
	this.specs = specs;

	this.modifiers = [
		{	// if undefined on that slot, return true
			case : function(ithSpec){ return !ithSpec },	
			is : function(){ return 1; },
			do : function(ithSpec, ithShape){console.log(Array.range(ithShape)); return Array.range(ithShape)}
		},
		{	// Accepts {start: , end: , every : , shift : ,}
			case : function(ithSpec){ return ithSpec && ithSpec.start },
			is : function(dim, ithSpec, ithShape){
				// var isInInterval = dim >= ithSpec.start && dim <= ithSpec.end;
				var isInInterval = dim >= r(ithSpec.start, ithShape) && dim <= r(ithSpec.end, ithShape);
				return isInInterval && ((dim + (ithSpec.shift ? ithSpec.shift : 0)) % (ithSpec.every ? ithSpec.every : 1) == 0 );
			},
			do : function(ithSpec, ithShape){
				var start = r(ithSpec.start, ithShape) - 1,
					end = r(ithSpec.end, ithShape) + 1;
				return Array.range(ithShape).slice(start, end)
							.filter(function(e){ return e % (ithSpec.every ? ithSpec.every : 1)==0; });
			}
		},
		{	// Accepts {slice:}
			case : function(ithSpec){ return ithSpec && ithSpec.slice },
			is : function(dim, ithSpec, ithShape){
				return dim == r(ithSpec.slice, ithShape);
			},
			do : function(ithSpec, ithShape){ return [ithSpec.slice]; }
		}
	];
}

Tautology.Regions.prototype.constructor = Tautology.Regions;

Tautology.Regions.prototype.getIndexTable = function(indexArray){
	var compiledRegions = {};

	var matchIndex = function(index, shape, spec){
		return index.every(function(dim, i){
			return this.modifiers.some(function(crit){
				return crit.case(spec[i]) && crit.is(dim, spec[i], shape[i]);
			})
		}.bind(this));
	}



	for (key in regions) {
		compiledRegions[key] = indexArray.findRegionIndex(shape, regions[key], modifiers);
	}

	return compiledRegions;
}