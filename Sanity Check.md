# Sanity check for the progress:

## Added the utility functions to the native JS array, which are
1. `Array.const`
   which generates a constant array with specific length
2. `Array.range`
   which generates an array of integers with ascending order
3. `Array.permute`
   generates a array of arrays with permutations of specifc array shape (which can be considered as the indices of a sparse array)

## Design of Tautology.Array
Tautology.Array is a multi-dimensional array stored as a sparse array. Each element contains an native JS array that represents the index in the multi-dimensional array, and a generic object. For not confusing with the index of native JS array, the index we just defined in the `Tautology.Array` will be called **"Tau-Index"**.

A `Tautology.Array` instance is initialized with the shape of the multi-dimensional sparse array. The Tau-Index is generated with the `Array.permute`, and then expanded as an object that associates the object created by given constructor.

A `compileQuery` method is defined to compile the query rules defined outside of the `Tautology.Array` instance. the query rules are a set of boolean functions to test whether a Tau-Index meets the criteria. If so, the reference of the object that cooresponds to the element that contains the Tau-Index will be pushed into an array, which will be associated to *the* `Tautology.Array` instance as a property.

**USAGE:**
A `Tautology.Array` instance shouldn't be modified directly. The shape of the instance should be determined before it's initialized. Removing the objects from the `Tautology.Array` would change the correspondence between Tau-Index and actual index, and it will be extremely annoying to update the compiled queries if you have done that before removing objects. Make sure to compile the queries when the Array elements doesn't change.

## Design of Tautology.Model
Tautology.Model is the data structure that holds the necessary information to represnt and manipulate a model. It holds a `Tautology.Array` instance, a `THREE.Geometry` instance, the operations to modify the data, the routine of initializing and forming the model, and the parameters needed by the routine. Notably, the operation set, the routine and the parameters are all defined outside of the class (i.e. the class that take `Tautology.Model` instance as property). Consequently, the `Tautology.Model` is only responsible for 

1. calculate the necessary vertices to initialize the `Tautology.Array`, apply the operations according to the operation set, the routine, and the parameters.
2. Generate the geometry and corresponding method for updating vertices.

Thus by far, we inevitably need to design the structure of parameters, operations and routines.

1. operations is pretty simple, just a list of key-value(function) pairs.
2. routines is a little more complex. we define that:
   a. a function call looks like: {func:name, args:list, query:}
      the args list can be another function call. For simplicity and security, we don't implement recursive calls right now. (but i can imagine it would be as fancy as _Mathematica_)
   b. 
3. parameters are a list of key-value(function) pairs as well, the value can be either a value or a function. we define the parameters must contain a shape function that returns the shape array for generating the `Tautology.Array` instance.

## Tautology.Point.js
`Tautology.Point` is definitely a 3D model specific library that contains the 3D spatial point data with its texture mapping coordinate. It also contains the necessary method for manipulating the point, which can be further utilized by the `Tautology.Model` class. The `Tautology.Point` data will be held by the `Tautology.Array`, and the method defined in the class will be used by the `Tautology.Model` class.

1. Test whether the Tautology.Array object in Tautology.Model is properly built.