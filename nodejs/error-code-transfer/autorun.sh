#!/bin/bash

PROJECT_ROOT=/Users/shengyan/Desktop/workspace/demos/nodejs/error-code-transfer
NPM_BIN=/Users/shengyan/.nvm/versions/io.js/v2.0.2/bin/npm

cd $PROJECT_ROOT
$NPM_BIN run step-0 >> run.log
$NPM_BIN run step-1 >> run.log
$NPM_BIN run step-2 >> run.log
