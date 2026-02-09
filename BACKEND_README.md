# Backend - Bookfair Stall Reservation API

## Quick Start
```bash
mvn spring-boot:run
```
API runs at: http://localhost:8080

## H2 Console (Database)
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:bookfair`
- Username: `sa`
- Password: (empty)

## TODO Checklist

### Dev 1: Publisher + Stall
- [ ] Add validation to `PublisherRequest` (@NotBlank, @Email)
- [ ] Add error handling for duplicate email
- [ ] Add stall filtering by size endpoint

### Dev 2: Reservation + Email/QR
- [ ] Implement `QrService.generateQrCode()` using ZXing
- [ ] Implement `EmailService.sendConfirmation()` with JavaMailSender
- [ ] Add proper exception handling (return 400/409 status codes)
- [ ] Test email with mailtrap.io

### Dev 3: Genre + Employee Portal
- [ ] Add bulk genre creation endpoint
- [ ] Create employee-specific endpoints in new `EmployeeController`
- [ ] Add summary statistics endpoint (total stalls, reserved, available)

## Testing Endpoints
Use Postman or curl:

```bash
# Register publisher
curl -X POST http://localhost:8080/api/publishers \
  -H "Content-Type: application/json" \
  -d '{"businessName":"Test Books","email":"test@test.com","contactPerson":"John"}'

# Get all stalls
curl http://localhost:8080/api/stalls

# Create reservation
curl -X POST http://localhost:8080/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"publisherId":1,"stallIds":[1,2]}'
```
