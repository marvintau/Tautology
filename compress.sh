#!/bin/bash

uglifyjs ./Tautology/Tautology.js \
         ./Tautology/Tautology.Utils.js \
         ./Tautology/Tautology.Range.js \
         ./Tautology/Tautology.Region.js \
         ./Tautology/Tautology.Transform.js \
         ./Tautology/Tautology.Geometry.js \
         ./Tautology/Tautology.Material.js \
         ./Tautology/Tautology.Model.js \
         ./Tautology/Tautology.ModelManager.js \
         -o Tautology.min.js \
         --source-map Tautology.min.js.map \
         --source-map-root http://foo.com/src \
         -p 5 -c -m