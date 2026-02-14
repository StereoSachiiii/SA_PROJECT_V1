# user_story_test.ps1

$baseUrl = "http://localhost:8080/api"
$suffix = Get-Random -Minimum 1000 -Maximum 9999
$username = "publisher_$suffix"
$email = "publisher_$suffix@example.com"
$password = "password123"

Write-Host "example user story: Publisher Registration & Reservation" -ForegroundColor Cyan
Write-Host "---------------------------------------------------"

# 1. Register
Write-Host "`n[1] Registering new user: $username..."
$registerBody = @{
    username = $username
    email = $email
    password = $password
    role = "VENDOR"
    businessName = "Best Books $suffix"
    contactNumber = "0771234567"
    address = "Colombo"
} | ConvertTo-Json

try {
    $regResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "User Registered Successfully!" -ForegroundColor Green
} catch {
    Write-Error "Registration Failed: $_"
    exit
}

# 2. Login
Write-Host "`n[2] Logging in..."
$loginBody = @{
    username = $username
    password = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    $userId = $loginResponse.id
    Write-Host "Login Successful!" -ForegroundColor Green
    Write-Host "Token: $token" -ForegroundColor Gray
    Write-Host "User ID: $userId" -ForegroundColor Gray
} catch {
    Write-Error "Login Failed: $_"
    exit
}

# 3. View Stalls
Write-Host "`n[3] Fetching Available Stalls..."
$headers = @{
    Authorization = "Bearer $token"
}

try {
    $stalls = Invoke-RestMethod -Uri "$baseUrl/stalls" -Method Get -Headers $headers
    $availableStalls = $stalls | Where-Object { $_.reserved -ne $true }
    if ($availableStalls.Count -eq 0) {
        Write-Error "No available stalls found!"
        exit
    }
    $stallToReserve = $availableStalls | Get-Random
    Write-Host "Selected Stall: $($stallToReserve.name) (ID: $($stallToReserve.id)) (Price: $($stallToReserve.priceCents))" -ForegroundColor Yellow
} catch {
    Write-Error "Failed to fetch stalls: $_"
    exit
}

# 4. Make Reservation
Write-Host "`n[4] Reserving Stall ID $($stallToReserve.id)..."
$reservationBody = @{
    userId = $userId
    stallIds = @($stallToReserve.id)
} | ConvertTo-Json

try {
    $resResponse = Invoke-RestMethod -Uri "$baseUrl/reservations" -Method Post -Body $reservationBody -ContentType "application/json" -Headers $headers
    Write-Host "Reservation Created!" -ForegroundColor Green
    Write-Host "Reservation ID: $($resResponse[0].id)" -ForegroundColor Cyan
    Write-Host "QR Code: $($resResponse[0].qrCode)" -ForegroundColor Cyan
} catch {
    Write-Error "Reservation Failed: $_"
    exit
}

# 5. Verify Reservation
Write-Host "`n[5] Verifying Reservation for User..."
try {
    $myReservations = Invoke-RestMethod -Uri "$baseUrl/reservations/user/$userId" -Method Get -Headers $headers
    if ($myReservations.Count -gt 0) {
        Write-Host "SUCCESS: Simulation Complete. User has confirmed reservations." -ForegroundColor Green
    } else {
        Write-Host "WARNING: No reservations found for user." -ForegroundColor Red
    }
} catch {
    Write-Error "Verification Failed: $_"
}
