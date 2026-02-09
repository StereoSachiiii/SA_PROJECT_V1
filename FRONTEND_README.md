# Frontend - Bookfair Stall Reservation

## Quick Start
```bash
npm install
npm run dev
```
Opens at: http://localhost:5173

## TODO Checklist

### Dev 1: Registration Flow
- [ ] Add form validation (required fields, email format)
- [ ] Add loading spinner component
- [ ] Create reusable Input component
- [ ] Style the form (make it pretty!)
- [ ] Add error toast notifications

### Dev 2: Stall Map + Reservation
- [ ] Create proper grid map based on stall positions
- [ ] Add color coding for stall sizes (Small=green, Medium=blue, Large=purple)
- [ ] Create Modal component for confirmation
- [ ] Add selection limit feedback (max 3 message)
- [ ] Add stall tooltips with details

### Dev 3: Home Page + Employee Portal
- [ ] Display QR codes using a QR library (qrcode.react)
- [ ] Add genre autocomplete/suggestions
- [ ] Create stats dashboard cards
- [ ] Add search/filter for reservations table
- [ ] Add export to CSV button

## File Structure
```
src/
├── api/              # API calls (DON'T MODIFY - shared)
│   ├── client.ts     # Axios instance
│   ├── publisherApi.ts
│   ├── stallApi.ts
│   ├── reservationApi.ts
│   └── genreApi.ts
├── components/       # Reusable UI (CREATE THESE)
│   └── (create as needed)
├── pages/            # Page components (YOUR WORK)
│   ├── RegisterPage.tsx      # Dev 1
│   ├── StallMapPage.tsx      # Dev 2
│   ├── HomePage.tsx          # Dev 3
│   └── EmployeePortalPage.tsx # Dev 3
├── hooks/            # Custom hooks (optional)
├── types/            # TypeScript types (DON'T MODIFY)
├── App.tsx           # Routes (DON'T MODIFY)
└── main.tsx          # Entry point (DON'T MODIFY)
```

## Useful Commands
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```
