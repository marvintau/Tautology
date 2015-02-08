# Design of Tautology

## Terminology
The spatial points in 3D model is represented as a vector. However here we may refer to another vector which means a row or a column in a matrix or an array. Thus here we define the vector as a row of number or some type of data, which is a component of matrix or array. The 3D vector will be called "vertex" in any interchangeable place.

## Index, Element and Array

__Index__
The reason we implement the index as a vector, and represent the array as sparse array, is because it's difficult to reveal the spatial relationship between vectors with uniform n-dimensional array in native data structure.

The index is more like a labeling method, rather than the coordinate of an unfolded 3D object (like what texture mapping coordinate does).

For example, if we are tessellating a triangle or a pentagon, a multi-dimensional label would be very useful. if we define the three vertices of a triangle as A(1, 0, 0), B(0, 1, 0) and C(0, 0, 1), then the arbitrary position on the triangle can be described as (a, b, X) where X is don't-care item, since the three bases are not independent. However, if we are representing a position on a pentagon, this notation will become extremely useful, because a two-vector-based coordinate representation can only deal with the polygon with no more than 4 edges. We need at least 2 quadrilaterals to cover a pentagon, and consequently need two two-vector bases. Thus we will need a label with at least 3 dimensions to describe it. Actually we may put all five edges as five dimensions on that, and need some extra modification when adjusting some of them (when adjusting two of them, the other three are automatically set don't care). This would be used on tessellating a regular polyhedron.

We've repeatedly examined this design. Suppose the element with index is stored in an array, without any auxiliary data structure, this indexing method increased the lookup time during manipulating data (O(m+n) -> O(m*n)), but greatly reduced the time of transposing an array (comparing to transpose operation over built-in array data structure, it merely swaps (or permutes) the index for each vertex, and no memory re-allocation is involved.)

If the vertices need to be frequently updated, surely the frequent lookup will cause a performance degradation. According to our design idea (which will be elaborated later on), this framework is to generate an adjustable 3D model, which means it will deliver a 3D model along with the function that update each vertices. Since exchanging data between CPU and GPU is very expensive, we won't generate the whole model from the scratch every time (frame). A better solution would be prepare all dumb vertices at first, and update the value of vertices on each frame. However, it's still very expensive to walk through the whole table for each operation (e.g. if we just want to modify a vector of vertices in the matrix) Thus the correspondence between the index and actual array index should be stored for updating vertices. So the best practice of designing the procedure of updating the vertices would be:

1. Separate the procedure of creating (create/duplicate vertices) and updating.
2. Minimize the usage of transpose, or leave the transpose in the creating stage.

The basic idea is to guarantee the correspondence between index and array index is always same in updating stage. Then it would be easy to replace the lookup with finding element with precise address.

#### There is no need to spend time on thinking alternative approach to represent the set of vertices. This is the best idea we've ever come up with. ####

__Element__
The current element design contains three properties, which are index, object to be hold (mostly the THREE.Vector3), and copyMethod (mostly THREE.Vector3.constructor.prototype.clone). We still make it generic and its fine. We might need to use Element to hold an array, which to be discussed below, but I don't think it's a good idea.

Element has three methods, clone, dispose and apply. clone makes a new copy, dispose erase itself, and apply applies a function over its content. The dispose method is due to the concern of some object that unable to be garbage-collected, but in our case, it's not an issue. However it should be noticed that an Element object should never be refered outer than an Array object. The function to be applied will take __ALL__ three properties and determine what to do. Because index is __often__ used for calculating vertices.

In our later design, Element contains exactly the THREE.Vector3 and a texture coord. this is due to our improper design about texture mapping part. Since most of our work relates to the vertices, it's proposed to change the general object into a THREE.js Vector object.


__Array__
The current array contains two properties with a helper function. It has a lot of functions that we haven't used before. We can make it more clear here: The array object is only responsible for manipulating the abstract data structure, such as the shape of the array, and numbers to keep. The array method do nothing with the data in element, for both Vectors and Texture coords.

Currently we didn't add the method of single-element insertion and removal, since we were still thinking the integrated data structure should be uniformed. But now I think it's probably wrong. If the data structure is not uniformed, then at most it will bring __A tiny bit__ difficulty on calculating the texture mapping. It's okay.

#### So we need to add the single element insertion/removal. ####

And here is some tips for actually using this array. A typical approach of modeling with polygons will be like:

1. figure out the proper spatial position of the point
2. make it into polygon/mesh
3. texture it.

A simple expansion of this procedure with our index will look like:
1. duplicate elements (and modify indices!)
2. move to spatial positions (that modify vectors)
3. repeat 1, 2 a couple of times. (which is not desirable)
4. texture it. (calculate the Texture coords)
5. cut the unnecessary part away.

the straightforward method will definitely bring a lot of performance lags. A better way will be like this:
1. duplicate elements (several times)
2. move to spatial positions (you can choose exactly same points since you know the index)
3. cut the unnecessary part away.
4. calc the Texture coords,

#### There is some concern about cutting the geometry. We used to think whether it's necessary to add a boolean deletion mark, so that we may apply some boolean set operation, and the answer is no. There is no need to add this property to Element, since we know exactly which vertices need to be applied with specific operation through the index.

# Model and Mesh

There are two main problems with our current design of Model class. The first problem is that we integrates two different kind of geometrical model. One is generated from the vertices, and the other comes from the control points of NURBS. 





