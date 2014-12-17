# Tautology Framework

1. **The Framework**
   The motivation of creating such a framework because we want to add more interactivity to the Geometry of THREE.js. The current implementation of geometry only contains a list of vertex and the polygons that represented by the index of vertices, which lacks the context of the object. This brings inconvenience in manipulating the geometry in interactive environment.

   Tautology.js makes it possible to manipulate the geometries. Our current implementation is to associate the vertex with specific index that represents the context of the geometry, such as the coordinate of a point on the surface of the cylinder. For complex geometries, we first generate vertices with specific number in function, and then arrange there spatial coordinates in another function. The function that generate the points will be executed only once, since it's unable to change the number of vertices once they are sent to the buffer of GPU. The function that arrange the points can be re-used when the vertex coordinate needs to be updated.

   1. **Index and Element**
      Before putting the vertices into Geometry, the vertices are stored in a special data structure, Tautologic Array. Tautologic Array stores elements in sparse-array form, instead of the native array object in JavaScript. There are mainly two reasons. Firstly, the index is a property of element. When we apply an operation over the element, we traverse it, and then check wheather the element meet our criteria. If stored as multi-dimensional(hierarchical) arrays, we may only use for-loop to iterate over all the arrays. This made the program structure much less clear.

      The index made easy for partitioning, flattening and other list operations, which are very handy when generating the data. With the index, it's able to apply operations on specific vertices of geometry.

   2. **PointCloud**
      This functionality has been delivered by Three.js. PointCloud, or particle system is very handy for validating the geometry structure before connecting the vertices as polygons, and then mapping texture. In tautology, this has been wrapped as a function.

   3. **Mesh Generator**
      For customized geometry, we need to map the vertices to the coordinates on the texture. For example, for an unfolded cylinder, we need to map the coordinates to a rectangle image or canvas, which can be considered as unfolded cylinder.

      Mesh generator takes a two-dimensional array as input, and generate another array ranged from 0 to 1 on both dimension. The value will be further filled into Geometry.faceVertexUvs, and possibly swap x and y to rotate (transpose) the direction of texture mapping.

   4. **NURBS [Still in progress]**
      NURBS consists of two basis functions on two dimensions. A basis function describes how a set of control point (a sequence of vector) affect the actual point on the curve. With the growth of the curve order, the curve will get flatter. You can specify the curvature of the curve at specific control point with **knot vector**.

      The NURB Curve can be defined recursively:
      
      curve = function(u, knot, span, order=0) {
         if (order==0) {
            return (knot[span] < u && knot[span+1]) ? 1 : 0;
         } else {
            return
            (knot[span+order] == knot[span]) ? 0 : (u - knot[span])/(knot[span+order]-knot[span]) * curve(u, knot, span, order - 1) +
            (knot[span+order+1] == knot[span+1]) ? 0 : (knot[span + 1] - u)/(knot[span+order+1]-knot[span+1]) * curve(u, knot)
         }
      }
      