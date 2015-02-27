The current design of Tautology has changed a lot since the last time we wrote this note. We did several experiments, while some are preserved and some are changed.

1. We used to attempt to discard the sparse-array index (a.k.a Tau-Index), and merely use the index of native array object. The index matching will be replaced with a series of modulo operation. However, we decided to give up with this design because it makes the structure of native array object very clumsy.

2. We decided to give up the "part", originally named "query". This is more like a pattern matching mechanism, we used to decide to match the Tau-index with a function that returns a boolean value, and then we thought about relace this function with an array that refers to either funciton or exact number, just like what we do in Mathematica. This would make the representation of pattern more simple, while the function on single dimension is more reusable. However, this made the representation much less flexibility. Because it's quite possible that we need to create a lot of function that only used in one single model.

3. Finally we also abandoned the reversed index, compiled query from Array. Because we figured out a very interesting solution. For each step of operation over each vector, we are not going to directly modify the value of vector, but generate the matrix for each step, and finally multiply them together to form a single matrix with regard of adjustable parameters.

## Drawing Method of the spoon-like straw:
1. The spoon-like straw consists of three parts, body, neck and spoon body. The neck part can be described as an ArcSin function when unfolded. While the spoon body part can be drawn with a varying composed transform clipped with an oval function.

2. Since the straw is a center-symmetric geometric model, the drawing can be spitted into two halves, which use one transformation and its inverse separately.

__TEST__:
If we apply the transform matrix on one half and apply the "inversed" transform over another half, the result is supposed to be identical.

