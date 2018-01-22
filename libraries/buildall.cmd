@echo off
cd botbuilder
echo tsc compiling: botbuilder
call tsc
if errorlevel 1 goto err

cd ..\botbuilder-node
echo tsc compiling: botbuilder-node
call tsc
if errorlevel 1 goto err

cd ..\botbuilder-services
echo tsc compiling: botbuilder-services
call tsc
if errorlevel 1 goto err

cd ..\botbuilder-ai
echo tsc compiling: botbuilder-ai
call tsc
if errorlevel 1 goto err

cd ..\botbuilder-azure
echo tsc compiling: botbuilder-azure
call tsc
if errorlevel 1 goto err

cd ..\botbuilder-choices
echo tsc compiling: botbuilder-choices
call tsc
if errorlevel 1 goto err

cd ..\botbuilder-legacy
echo tsc compiling: botbuilder-legacy
call tsc
if errorlevel 1 goto err

cd ..\botbuilder-lunr
echo tsc compiling: botbuilder-lunr
call tsc
if errorlevel 1 goto err

cd ..\botbuilder-rivescript
echo tsc compiling: botbuilder-rivescript
call tsc
if errorlevel 1 goto err

echo build complete
goto end
:err
@echo BUILD FAILED 1>&2

:end
cd ..
