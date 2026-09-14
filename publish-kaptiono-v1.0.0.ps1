param(
    [switch]$SkipRelease
)

$ErrorActionPreference = 'Stop'

$version = '1.0.0'
$tag = "v$version"
$repoSlug = 'Donacgreece/Kaptiono'
$remote = 'https://github.com/Donacgreece/Kaptiono.git'
$repo = Join-Path $env:USERPROFILE 'Downloads\Kaptiono-Web'
$zip = Join-Path $env:USERPROFILE 'Downloads\kaptiono-web-lab-v1.0.0-github-pages.zip'
$temp = Join-Path $env:TEMP 'kaptiono-v1.0.0-release'
$archiveDir = Join-Path $env:USERPROFILE 'Downloads\Kaptiono-Releases\v1.0.0'
$description = 'Privacy-first AI subtitle generator with Local Whisper, optional Cloud High Accuracy, caption editing, PWA support and no-watermark exports.'
$homepage = 'https://kaptiono.com/'

$topics = @(
    'ai-subtitles',
    'subtitle-generator',
    'caption-generator',
    'automatic-captions',
    'whisper',
    'openai-whisper',
    'speech-to-text',
    'local-ai',
    'video-captions',
    'srt',
    'pwa',
    'webassembly',
    'privacy-first',
    'no-watermark',
    'creator-tools',
    'tiktok-captions',
    'youtube-shorts',
    'instagram-reels',
    'video-editing',
    'browser-app'
)

function Assert-NativeSuccess([string]$message) {
    if ($LASTEXITCODE -ne 0) {
        throw $message
    }
}

function Write-Utf8NoBom([string]$path, [string]$content) {
    $encoding = New-Object System.Text.UTF8Encoding -ArgumentList $false
    [System.IO.File]::WriteAllText($path, $content, $encoding)
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw 'Git is not installed or not available in PATH.'
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw 'GitHub CLI (gh) is not installed or not available in PATH.'
}

gh auth status
Assert-NativeSuccess 'GitHub CLI is not authenticated. Run gh auth login first.'

if (-not (Test-Path -LiteralPath $zip)) {
    throw "Release ZIP not found: $zip"
}

if (Test-Path -LiteralPath $temp) {
    Remove-Item -LiteralPath $temp -Recurse -Force
}

New-Item -ItemType Directory -Path $temp | Out-Null
Expand-Archive -LiteralPath $zip -DestinationPath $temp -Force

$source = Join-Path $temp 'kaptiono-web-lab-v1.0.0'
if (-not (Test-Path -LiteralPath $source)) {
    throw "Release folder not found inside ZIP: $source"
}

$requiredFiles = @(
    'version.json',
    'README.md',
    'CHANGELOG.md',
    'RELEASE_PROCESS.md',
    'RELEASE_NOTES_v1.0.0.md',
    'SECURITY.md',
    'CONTRIBUTING.md',
    'sitemap.xml',
    'robots.txt',
    'llms.txt',
    'about\index.html',
    'partners\index.html',
    'assets\screenshots\about-desktop.png',
    'assets\screenshots\about-mobile.png',
    'google6ca96312d74da820.html'
)

foreach ($relativePath in $requiredFiles) {
    $fullPath = Join-Path $source $relativePath
    if (-not (Test-Path -LiteralPath $fullPath)) {
        throw "Required release file is missing: $relativePath"
    }
}

$versionJson = Get-Content -LiteralPath (Join-Path $source 'version.json') -Raw
if ($versionJson -notmatch '"version"\s*:\s*"1\.0\.0"') {
    throw 'version.json does not report version 1.0.0.'
}

$homeHtml = Get-Content -LiteralPath (Join-Path $source 'index.html') -Raw
if ($homeHtml -match 'https://kaptiono\.com/en') {
    throw 'Invalid /en hreflang URL is still present in index.html.'
}

$sitemap = Get-Content -LiteralPath (Join-Path $source 'sitemap.xml') -Raw
foreach ($url in @(
    'https://kaptiono.com/',
    'https://kaptiono.com/about/',
    'https://kaptiono.com/partners/',
    'https://kaptiono.com/privacy/',
    'https://kaptiono.com/cookies/',
    'https://kaptiono.com/terms/'
)) {
    if ($sitemap -notmatch [regex]::Escape($url)) {
        throw "Sitemap is missing: $url"
    }
}

if (-not (Test-Path -LiteralPath (Join-Path $repo '.git'))) {
    if (Test-Path -LiteralPath $repo) {
        Remove-Item -LiteralPath $repo -Recurse -Force
    }
    git clone $remote $repo
    Assert-NativeSuccess 'Git clone failed.'
}

Set-Location $repo

git checkout main
Assert-NativeSuccess 'Could not check out main.'

git pull --ff-only origin main
Assert-NativeSuccess 'Could not fast-forward main from origin.'

Get-ChildItem -LiteralPath $repo -Force |
    Where-Object { $_.Name -ne '.git' } |
    Remove-Item -Recurse -Force

Get-ChildItem -LiteralPath $source -Force |
    Copy-Item -Destination $repo -Recurse -Force

git add -A
$changes = git status --porcelain

if ($changes) {
    git commit -m 'Finalize Kaptiono v1.0.0 repository, release archive and SEO'
    Assert-NativeSuccess 'Git commit failed.'

    git push origin main
    Assert-NativeSuccess 'Git push failed.'
}
else {
    Write-Host 'Source is already identical to origin/main. Continuing with repository metadata and release checks.' -ForegroundColor Yellow
}

$metaFile = Join-Path $env:TEMP 'kaptiono-repo-metadata.json'
$metaJson = [ordered]@{
    description = $description
    homepage = $homepage
} | ConvertTo-Json -Compress
Write-Utf8NoBom $metaFile $metaJson

gh api --method PATCH "repos/$repoSlug" --input $metaFile | Out-Null
Assert-NativeSuccess 'Could not update GitHub repository description/homepage.'

$topicsFile = Join-Path $env:TEMP 'kaptiono-repo-topics.json'
$topicsJson = @{ names = $topics } | ConvertTo-Json -Compress
Write-Utf8NoBom $topicsFile $topicsJson

gh api --method PUT -H 'Accept: application/vnd.github+json' "repos/$repoSlug/topics" --input $topicsFile | Out-Null
Assert-NativeSuccess 'Could not update GitHub repository topics.'

New-Item -ItemType Directory -Path $archiveDir -Force | Out-Null
$archiveZip = Join-Path $archiveDir (Split-Path $zip -Leaf)
Copy-Item -LiteralPath $zip -Destination $archiveZip -Force

$hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $zip).Hash.ToLowerInvariant()
$checksumName = 'kaptiono-web-lab-v1.0.0-github-pages.zip.sha256'
$checksumFile = Join-Path $archiveDir $checksumName
Set-Content -LiteralPath $checksumFile -Encoding Ascii -Value "$hash  kaptiono-web-lab-v1.0.0-github-pages.zip"

Copy-Item -LiteralPath (Join-Path $repo 'RELEASE_NOTES_v1.0.0.md') -Destination $archiveDir -Force

$head = (git rev-parse HEAD).Trim()
Assert-NativeSuccess 'Could not resolve the current commit.'

$manifest = [ordered]@{
    version = $version
    tag = $tag
    commit = $head
    archive = 'kaptiono-web-lab-v1.0.0-github-pages.zip'
    sha256 = $hash
    production_url = 'https://kaptiono.com/'
    created_utc = (Get-Date).ToUniversalTime().ToString('o')
}
$manifestFile = Join-Path $archiveDir 'kaptiono-v1.0.0-release-manifest.json'
Write-Utf8NoBom $manifestFile ($manifest | ConvertTo-Json)

if ($SkipRelease) {
    Write-Host 'GitHub Release step skipped by request.' -ForegroundColor Yellow
    Write-Host "Local archive: $archiveDir" -ForegroundColor Cyan
    exit 0
}

git fetch origin --tags
Assert-NativeSuccess 'Could not fetch Git tags.'

$existingTag = (git tag --list $tag | Out-String).Trim()
if (-not $existingTag) {
    git tag -a $tag -m 'Kaptiono v1.0.0 stable release'
    Assert-NativeSuccess 'Could not create the release tag.'

    git push origin $tag
    Assert-NativeSuccess 'Could not push the release tag.'
}
else {
    $tagCommit = (git rev-list -n 1 $tag).Trim()
    if ($tagCommit -ne $head) {
        Write-Host ''
        Write-Host "Release tag $tag already exists and points to a different commit." -ForegroundColor Red
        Write-Host "Tag commit: $tagCommit" -ForegroundColor Red
        Write-Host "Current main: $head" -ForegroundColor Red
        Write-Host 'The tag was NOT moved. Published production tags should remain immutable.' -ForegroundColor Yellow
        Write-Host 'Main, README, SEO, repository topics and the local backup archive were updated successfully.' -ForegroundColor Yellow
        Write-Host 'Use the next semantic version for a new production release.' -ForegroundColor Yellow
        exit 2
    }
}

$releaseNotes = Join-Path $repo 'RELEASE_NOTES_v1.0.0.md'
$releaseExists = $true

gh release view $tag --repo $repoSlug *> $null
if ($LASTEXITCODE -ne 0) {
    $releaseExists = $false
}

if ($releaseExists) {
    gh release edit $tag --repo $repoSlug --title 'Kaptiono v1.0.0' --notes-file $releaseNotes --latest
    Assert-NativeSuccess 'Could not update the GitHub Release.'
}
else {
    gh release create $tag --repo $repoSlug --title 'Kaptiono v1.0.0' --notes-file $releaseNotes --latest
    Assert-NativeSuccess 'Could not create the GitHub Release.'
}

gh release upload $tag $archiveZip $checksumFile $manifestFile --repo $repoSlug --clobber
Assert-NativeSuccess 'Could not upload one or more GitHub Release assets.'

Write-Host ''
Write-Host 'Kaptiono v1.0.0 repository and release publishing completed successfully.' -ForegroundColor Green
Write-Host "Commit: $head" -ForegroundColor Cyan
Write-Host "SHA256: $hash" -ForegroundColor Cyan
Write-Host "Local archive: $archiveDir" -ForegroundColor Cyan
Write-Host 'Release: https://github.com/Donacgreece/Kaptiono/releases/tag/v1.0.0' -ForegroundColor Cyan
Write-Host 'Production: https://kaptiono.com/' -ForegroundColor Cyan
