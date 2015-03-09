Tautology.Regions = function(specs){
	this.specs = specs;

	this.modifiers = [
		{	// if undefined on that slot, return true
			case : function(ithSpec){ return ithSpec=='all' },	
			is : function(){ return 1; },
			do : function(ithSpec, ithShape){return Array.range(ithShape)}
		},
		{	// Accepts {start: , end: , every : , shift : ,}
			case : function(ithSpec){ return ithSpec.length },
			is : function(dim, ithSpec, ithShape){
				// var isInInterval = dim >= ithSpec[0] && dim <= ithSpec[1];
				var isInInterval = dim >= r(ithSpec[0], ithShape) && dim <= r(ithSpec[1], ithShape);
				return isInInterval && (dim % (ithSpec[2] ? ithSpec[2] : 1) == 0 );
			},
			do : function(ithSpec, ithShape){
				var start = r(ithSpec[0], ithShape) - 1,
					end = r(ithSpec[1], ithShape) + 1;
				return Array.range(ithShape).slice(start, end)
							.filter(function(e){ return e % (ithSpec[2] ? ithSpec[2] : 1)==0; });
			}
		},
		{	// Accepts {slice:}
			case : function(ithSpec){ return !isNaN(ithSpec) },
			is : function(dim, ithSpec, ithShape){
				return dim == r(ithSpec, ithShape);
			},
			do : function(ithSpec, ithShape){ return [ithSpec]; }
		}
	];
}

Tautology.Regions.prototype.constructor = Tautology.Regions;

Tautology.Regions.prototype.getDimensionTables = function(shape){
	this.dimensionTables = {};

	for (spec in this.specs){
		this.dimensionTables[spec] = this.specs[spec].map(function(ithSpec, ith){
			for (var i = this.modifiers.length - 1; i >= 0; i--) {
				if (this.modifiers[i].case(ithSpec)) {
					return this.modifiers[i].do(ithSpec, shape[ith]);
				}
			};
			return [];
		}.bind(this));
	}
	return 0;
}

Tautology.Regions.prototype.compile = function(indexArray, shape){
	this.compiled = {};

	var matchIndex = function(index, shape, spec, modifiers){
		return index.every(function(dim, i){
			return modifiers.some(function(modifier){
				return modifier.case(spec[i]) && modifier.is(dim, spec[i], shape[i]);
			});
		});
	}

	for (var i = indexArray.length - 1; i >= 0; i--) {
		for (spec in this.specs){
			if (matchIndex(indexArray[i], shape, this.specs[spec], this.modifiers)){
				if (this.compiled[spec]) {
					this.compiled[spec].push(i)
				} else {
					this.compiled[spec] = [i];
				}
			}
		}
	};
}