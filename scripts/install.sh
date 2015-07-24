#!/bin/bash
echo "npm install"
npm install
echo "tsd install"
tsd reinstall --save
echo "compiling to js"
tsc
echo "DONE. run: "
echo "node dist/app.js"
