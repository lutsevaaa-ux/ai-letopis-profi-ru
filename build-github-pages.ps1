$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$docsRoot = Join-Path $projectRoot "docs"
$docsMemes = Join-Path $docsRoot "generated-memes"

if (-not (Test-Path $docsRoot)) {
  New-Item -ItemType Directory -Path $docsRoot | Out-Null
}

if (-not (Test-Path $docsMemes)) {
  New-Item -ItemType Directory -Path $docsMemes | Out-Null
}

Copy-Item (Join-Path $projectRoot "chronicle.html") (Join-Path $docsRoot "index.html") -Force
Copy-Item (Join-Path $projectRoot "chronicle.html") (Join-Path $docsRoot "chronicle.html") -Force
Copy-Item (Join-Path $projectRoot "chronicle.css") (Join-Path $docsRoot "chronicle.css") -Force
Copy-Item (Join-Path $projectRoot "chronicle.js") (Join-Path $docsRoot "chronicle.js") -Force
Copy-Item (Join-Path $projectRoot "chronicle-style.js") (Join-Path $docsRoot "chronicle-style.js") -Force
Copy-Item (Join-Path $projectRoot "chronicle-default-data.js") (Join-Path $docsRoot "chronicle-default-data.js") -Force
Copy-Item (Join-Path $projectRoot "chronicle-data.json") (Join-Path $docsRoot "chronicle-data.json") -Force
Copy-Item (Join-Path $projectRoot "editor.html") (Join-Path $docsRoot "editor.html") -Force
Copy-Item (Join-Path $projectRoot "editor.css") (Join-Path $docsRoot "editor.css") -Force
Copy-Item (Join-Path $projectRoot "editor.js") (Join-Path $docsRoot "editor.js") -Force

if (Test-Path (Join-Path $projectRoot "generated-memes")) {
  Copy-Item (Join-Path $projectRoot "generated-memes\\*") $docsMemes -Recurse -Force
}

New-Item -ItemType File -Path (Join-Path $docsRoot ".nojekyll") -Force | Out-Null

Write-Output "GitHub Pages files are ready in: $docsRoot"
