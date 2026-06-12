@echo off
set PYTHONIOENCODING=utf-8
cd /d "%~dp0.."
"C:\Users\nisim\AppData\Local\Programs\Python\Python311\python.exe" tools/segment_person.py > tools\segment_log.txt 2>&1
echo Exit code: %ERRORLEVEL% >> tools\segment_log.txt
