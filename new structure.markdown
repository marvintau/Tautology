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