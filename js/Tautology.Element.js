// The Tautological Element is the finest unit that organizes data. It holds
// Three types of information, including index (representation of structure),
// query (criteria of finding the element) and the object. All three types of
// data should be defined outside this class.
// (apparently we haven't realize it now.)

// The index class should consist of method about manipulating index. Since
// the index represent multi-dimensional matrix, it should represents the way
// to initialize, manipulate, reduce or add more dimensions, and export to
// string to make it as key for quick look-up. Moreover, it can be mapped to
// a partial-order value for sorting.
// COPY THE PARAGRAPH ABOVE INTO THE NEW CREATED INDEX CLASS [DONE]

// The query class should consist of method about verifying a dimension of
// an index. Since the query array is usually changing, there is no need to
// store it. However some of the queries over a particular dimension are
// freuquently used, like even, odd, or don't-care. The query class specifies
// the procedure of matching between index array and query array, and the
// detailed matching criteria are specified by user.
// COPY THE PARAGRAPH ABOVE INTO THE QUERY CLASS [DONE]

// After separating the functionalities away, the main task of Tautological
// Element is to create a new copy of itself, and apply the object method
// when the query criterion is true.

// TODO: SEPARATE THE INDEX METHOD AWAY FROM THIS CLASS [DONE]

Tautology.Element = function(index, object){
	this.index  = index
	this.object = object;
}

Tautology.Element.prototype = {
	constructor : Tautology.Element,

	clone : function(copyMethod){
		return new Tautology.Element(this.index.clone(), 
									 copyMethod.call(this.object));	
	},

	dispose : function(disposeMethod){
		this.index = null;
		disposeMethod.call(this.object);
		this.object = null;
	},

	apply : function(func, queryArray){
		this.index.match(queryArray) && func.call(this);
	}
}
