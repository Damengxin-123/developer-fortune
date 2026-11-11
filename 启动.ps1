# 使用本地 HTTP 服务，让浏览器能够可靠读写抽签记录 Cookie。
$ErrorActionPreference = 'Stop'
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($null -eq $nodeCommand) {
    Write-Host '未找到 Node.js，请先安装 Node.js，或使用其他本地 HTTP 服务打开本项目。' -ForegroundColor Yellow
    exit 1
}
& $nodeCommand.Source (Join-Path $PSScriptRoot 'server.mjs') --open
