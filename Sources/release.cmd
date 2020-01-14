@echo off

set PLUGIN=es.jsj.digitalclock
set PLUGIN_UUID=%PLUGIN%.sdPlugin
set DIR_RELEASE=..\Release

del %DIR_RELEASE%\%PLUGIN%.streamDeckPlugin
DistributionTool.exe -b -i %PLUGIN_UUID% -o %DIR_RELEASE%

pause
