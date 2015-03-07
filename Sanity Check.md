Now we are going to ignore the development of NURBS based surface creating. Since most of the code in manuever is duplicated, and basically we just copy and paste code for same functionality. So naturally we came up with the idea that if it's possible to replace the function declarations in the class, with some calls of corresponding function generator.

However, the immediate problem we met is, if we are going to use the function generator instead of direct function definition, we have to pass the argument of property to that function, while the arguments can actually represented as strings, if the length, or the strucutre of the parameters is fixed.

i.e. {min:xxx, max:xxx, val:xxx}

So all of the initialization of the data structure (memory allocation) of intermediate result, and corresponding modification, should be done within the manuever, so the parameter data structure should store no intermediate result.

So let's just describe a possible implementation of trans.

First, we need to define the initiator, which stores the reference of parameter, reference of the vertices list, affected indices, translation.

