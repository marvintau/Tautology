# Structure of parameters
1. __parameters:__
   Parameters can be modified only by slider bar, or user operations. Parameters consists of min/max value

2. __intermediate results:__
   Intermediate results will be also changed if the parameters are modifed. Thus it's can be implemented either by getter (changes every time when called) or inited in a function and updated by another.

   Getters actually should be avoided since the behavior is not quite clear. We have tested that the getter becomes pretty slow when generating massive data. Thus we speculate that getter is not quite optimized. Alternatively, we should leave all memory-allocating operations in the init phase.

   So how should we use getters? A good feature of getter is to indicate a necessary property (which can be used for triggering some operation), and combine other existing properties.

3. __modifiable data:__
   Modifiable data is actually generated from intermediate results or other modifiable data. As its name implies, the modifiable data can be modified.
   The design of modifiable data is based on two guidelines: generate all data that can be cached to save the computation time, and avoid all possible memory-allocating operations in the updating phase.

   We let all memory allocating procedure lie in the init phase, and all setting procedure in update phase.

# Detailed procedure of producing a membrane based geometry:

1. __User-adjust parameters__
   nothing much to say...

2. __Shape of the vertex__
   the shape of the vertex will be fixed. The initiator checks if the parameter contains "shape" getter, and add a new property "array" which indicates the index of the vertices.

   __QUICK QUESTION: Do we still need array when we can compile Parts?__
   Yes. Because the Part doesn't represents the topology relationship of the vertex. For the calculation of vertex position and texture mapping, we still needs array.

3. __Regions__
   Regions consists a set of range over different dimension. The parts will be further interpreted as a set of arrays, with the elements corresponding to the actual index in the vertex array in the THREE.Geometry.vertices.

   Regions can be generated with different ways. And here are the two ways we are immediately going to use:

   * __Interval__: Interval defines a sub-array or a partition of array. The interval part is supposed to be applied with same operation.

   * __Table__: Table generates sub-arrays of an interval. Useful when the operations to be applied on the sub-array is related to the index.

   Regions depends on array. So check if an array exists before compiling the regions. And also, Parts only needs to be compiled once, and can be stored and directly loaded next time.

4. __2D Coords & Bound__
   A new 3D transforming method separates 2D and 3D object formation, what we called "Rolling method". Instead of directly assigning the spatial position of a vertex, the rolling method represents a more realistic way to reveal how a planar vertex moved to its spatial position. It is just like how do we process a paper, plastic membrane or steel plate, with bender and cutter. The transformation will be applied repetitively, just like a bending machine. Therefore, for each single bending operation, we may separate the "forwarding" and "bending" operation into a translating vector and a rotation matrix (or a quaternion), and form a "rolling matrix".

   By far, though the spatial position of each vertex is still (0, 0, 0), but with the index, we have built the topological relationship between vertices. With the radius and length specified, we may calculate the planar offset of each vertex. And this will become the texture mapping coordinates.

   Within this stage, the clipping procedure will be also applied. The bound of the plane is specified with the control points of bezier curve, along with the affected axis and regions.

4. __Transform__
   Geometric transform determines the spatial position of the vertices. In our implementation so far, we have employed two different ways. The first one is to apply the transformation directly on vertices, which means the calculation of the vertex position is an one-time operation. The second one is to apply the transformation repeatedly, what we called "rolling method". The second one is more complex, yet it have two major advantage:

   * represent more realistic operation: we have seen the folding of the flexible straw.
   * Easy to calculate the texture mapping. As the name implies, the rolling method rolls a 2D plane to a 3D model, which separates the process of forming the 2D "material" and folding into different procedure, which doesn't stretch the material.

   When the parameter changes, all the transform applied on the vertex will be changed accordingly, thus Transform is modifiable data, rather than intermediate result.

5. __Facets__
   Facets are actually directly calculated from Array, and depends nothing else.

# Process design

The drawing procedure is separated into two parts, initiating and updating. All memory allocation is done in initiating phase, and updating should only modify the existing value, without creating anything.

So we have several crucial information to determine the architecture, which are index, regions, transforms, among which regions and transforms will be modified during updating.

Array is relatively fixed, since the number and sequence vertex table never changes.

Regions are described with type, range, and axis. it produces an integer array with same length of vertex table, which contains the mark that indicates which regions does a vertex belong to.

2D coords are merely calculated from array and other given parameters. Without bound, the 2D coords will be uniformly distributed. The bounds are approximated from Bezier curve, with the unit length is evenly distributed, which cause the grid distributed unevenly. Thus bounds are calculated at the first time, and determines the offset of vertices within the affected region.

> A more detailed procedure: With the control points of the bezier curve, with steps of the resolution or the number of rows/cols in the region. the coordinate on the axis that is not being cut will be assigned with values, yet the other axis will be trimmed.

>> The trimmed points will be assigned with same offset (2d coordinate)
__We don't have to think about the data structure right now, but we may first think about what we should get.__

> 
