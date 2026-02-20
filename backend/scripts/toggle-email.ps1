<#
Simple toggle script that remembers whether the next run should fire a
"test" message to your inbox.  Each execution flips the stored state; when
it transitions to ON the script will call the existing send-me-email helper.

The state is stored in a small text file alongside the script, and the
address/time/etc. are identical to the other helpers.

Usage:
    cd backend\scripts
    .\toggle-email.ps1          # flip state and maybe send
    .\toggle-email.ps1 -to foo  # send to a different address when turning on
#>

param(
    [string]$to = "niroshasulochini@gmail.com",
    [string]$url = "http://localhost:8080/api/email/test",
    [string]$stateFile = "toggle-state.txt"
)

# ensure state file exists
if (-not (Test-Path $stateFile)) {
    "off" | Out-File -Encoding utf8 $stateFile
}

$state = Get-Content $stateFile -Raw | Trim
$newState = if ($state -eq 'on') { 'off' } else { 'on' }

Write-Host "Previous state: $state -> new state: $newState"
$out = $newState | Out-File -Encoding utf8 $stateFile

if ($newState -eq 'on') {
    Write-Host "State is ON; sending test email to $to"
    try {
        $resp = Invoke-RestMethod -Uri "$url?to=$to" -Method Get -TimeoutSec 30
        Write-Host "Service responded: $resp"
    } catch {
        Write-Error "Failed to contact email endpoint:`n$_"
    }
} else {
    Write-Host "State is OFF; no email sent."
}
