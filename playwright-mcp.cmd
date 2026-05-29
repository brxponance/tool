@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "CLI_PATH=%SCRIPT_DIR%.playwright-mcp\node_modules\@playwright\mcp\cli.js"

if not exist "%CLI_PATH%" (
	>&2 echo Playwright MCP is not installed in "%SCRIPT_DIR%.playwright-mcp".
	>&2 echo Run: npm install --prefix "%SCRIPT_DIR%.playwright-mcp" @playwright/mcp@latest
	exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
	>&2 echo Node.js was not found on PATH.
	exit /b 1
)

node "%CLI_PATH%" %*
