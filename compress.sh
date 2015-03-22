#!/bin/bash

uglifyjs ./Tautology/Tautology.js \
         ./Tautology/Tautology.Utils.js \
         ./Tautology/Tautology.Range.js \
         ./Tautology/Tautology.Region.js \
         ./Tautology/Tautology.Transform.js \
         ./Tautology/Tautology.Geometry.js \
         ./Tautology/Tautology.Material.js \
         ./Tautology/Tautology.ModelManager.js \
         -o Tautology.min.js \
         --source-map Tautology.min.js.map \
         --source-map-root http://foo.com/src \
         -p 5 -c -m

uglifyjs ./UI/UI.js \
         ./UI/UI.Three.js \
         ./UI/UI.Two.js \
         ./UI/UI.Controller.js \
         -o UI.min.js \
         --source-map UI.min.js.map \
         --source-map-root http://foo.com/src \
         -p 5 -c -m