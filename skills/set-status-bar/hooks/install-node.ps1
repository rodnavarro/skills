# Runs at Claude Code start on Windows when `node` isn't found: installs Node.js LTS once,
# then copies the status line script with the new node. Windows asks once to allow the install.
$ErrorActionPreference = 'SilentlyContinue'
$config = if ($env:CLAUDE_CONFIG_DIR) { $env:CLAUDE_CONFIG_DIR } else { Join-Path $HOME '.claude' }
$marker = Join-Path $config '.status-bar-node-install'
if (Test-Path $marker) { exit 0 }
New-Item -ItemType Directory -Force -Path $config | Out-Null
Set-Content -Path $marker -Value (Get-Date -Format o)

if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
  Write-Output '{"systemMessage":"The status bar needs Node.js. Install Node.js LTS from https://nodejs.org, then reopen Claude Code."}'
  exit 0
}
winget install -e --id OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements | Out-Null

$node = Join-Path $env:ProgramFiles 'nodejs\node.exe'
if (Test-Path $node) {
  & $node (Join-Path $PSScriptRoot 'copy-statusline.cjs')
  Write-Output '{"systemMessage":"Node.js is installed for the status bar. Close and reopen Claude Code to see it."}'
} else {
  Write-Output '{"systemMessage":"The status bar needs Node.js, and the install did not finish. Install Node.js LTS from https://nodejs.org, then reopen Claude Code."}'
}
exit 0
