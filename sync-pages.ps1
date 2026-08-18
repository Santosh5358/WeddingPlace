$ErrorActionPreference = 'Stop'

$root = $PSScriptRoot
$updated = @()
$created = @()
$skipped = @()

Get-ChildItem -Path $root -Directory | ForEach-Object {
  $codePath = Join-Path $_.FullName 'code.html'
  if (-not (Test-Path -LiteralPath $codePath)) {
    return
  }

  $indexPath = Join-Path $_.FullName 'index.html'
  if (Test-Path -LiteralPath $indexPath) {
    $codeHash = (Get-FileHash -LiteralPath $codePath -Algorithm SHA256).Hash
    $indexHash = (Get-FileHash -LiteralPath $indexPath -Algorithm SHA256).Hash
    if ($codeHash -eq $indexHash) {
      $skipped += $_.Name
      return
    }

    Copy-Item -LiteralPath $codePath -Destination $indexPath -Force
    $updated += $_.Name
    return
  }

  Copy-Item -LiteralPath $codePath -Destination $indexPath -Force
  $created += $_.Name
}

Write-Output 'Sync complete.'
Write-Output ("Updated: " + ($(if ($updated.Count) { $updated -join ', ' } else { 'none' })))
Write-Output ("Created: " + ($(if ($created.Count) { $created -join ', ' } else { 'none' })))
Write-Output ("Already in sync: " + ($(if ($skipped.Count) { $skipped -join ', ' } else { 'none' })))
