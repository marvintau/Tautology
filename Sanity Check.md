# Sanity check for the progress:

## Added the array manipulation functions, which are
1. __const__
   which generates a constant array with specific length
2. __range__
   which generates an array of integers with ascending order
3. __permute__
   generates a array of arrays with permutations of specifc array shape (which can be considered as the indices of a sparse array)

## Proposed method in Tautology.Array
we have implemented the construction of a Tautology.Array which specifies the dimensions of the array in the constructor instead of initialize it with another function.

Now we need to make a new (conceivably better) way of organizing the procedure code. Originally, the vertices creation and manipulation are alterated, which brings some difficulties when spliting the operation into vertices creation and updating, while only the latter one should be repeatedly running. Although manipulaitng the vertices while creating is more intuitive, the new way of writing the code we proposed, is to generate all of the elements at very first time (which means we have to calculate the number of the vertices we are going to use in advance. although this is not quite intuitive, but soon you will get used with it.)

And consequently, the method to duplicate method is not quite useful, and we will remove this method in the next version.

## Proposed method in Javascript Native Array
Since both of the index and shape are intrinsically represented with a array, the re-permutation of an array should be associate with Native array class, so there's no need to implement another shape class to specify the permutating method.