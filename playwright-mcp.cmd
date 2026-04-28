@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
"C:\Program Files\nodejs\npx.cmd" -y @playwright/mcp@latest %*
