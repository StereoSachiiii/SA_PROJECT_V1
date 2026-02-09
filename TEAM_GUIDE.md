# 📚 Colombo Bookfair - Complete Developer Guide

> **Read this fully before starting. Share your role section with teammates.**

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐│
│  │ RegisterPage │→│ StallMapPage │→│   HomePage   │ │EmployeePort││
│  │   (Dev F1)   │ │   (Dev F2)   │ │   (Dev F3)   │ │  (Dev F3)   ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────────┘│
│                              ↓ HTTP/JSON                            │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Spring Boot)                          │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                      Controllers (REST API)                     │ │
│  │  PublisherController │ StallController │ ReservationController │ │
│  │      (Dev B1)        │    (Dev B1)     │       (Dev B2)        │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                              ↓                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                      Services (Business Logic)                  │ │
│  │  PublisherService │ StallService │ ReservationService │ Email  │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                              ↓                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    Repositories (Database)                      │ │
│  │    PublisherRepo │ StallRepo │ ReservationRepo │ GenreRepo     │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                              ↓                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                      H2 Database (In-Memory)                    │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Backend
| Technology | Purpose | Learn More |
|------------|---------|------------|
| **Java 17** | Programming language | Already know Java basics |
| **Spring Boot 3** | Web framework | Creates REST APIs easily |
| **Spring Data JPA** | Database ORM | Maps Java objects ↔ Database tables |
| **H2 Database** | In-memory SQL DB | No setup needed, auto-creates tables |
| **Lombok** | Reduces boilerplate | `@Data` auto-generates getters/setters |
| **ZXing** | QR code generation | Library for creating QR images |

### Frontend
| Technology | Purpose | Learn More |
|------------|---------|------------|
| **React 18** | UI library | Component-based UI |
| **TypeScript** | Typed JavaScript | Catches errors before runtime |
| **Vite** | Build tool | Fast dev server |
| **TanStack Query** | Server state | Fetches/caches API data |
| **Axios** | HTTP client | Makes API calls |
| **Tailwind CSS** | Styling | Utility-first CSS classes |

---

## 🎯 Design Patterns Used

### Backend Patterns
1. **Layered Architecture**: Controller → Service → Repository → Entity
2. **Dependency Injection**: Spring auto-wires dependencies (`@RequiredArgsConstructor`)
3. **DTO Pattern**: Separate request/response objects from entities
4. **Repository Pattern**: Data access abstraction via JPA

### Frontend Patterns
1. **Component-Based**: Reusable UI components
2. **Container/Presentation**: Pages (containers) vs Components (presentation)
3. **Custom Hooks**: API logic in `useQuery`/`useMutation` hooks
4. **Centralized API Layer**: All API calls in `/api` folder

---

# 👨‍💻 BACKEND TEAM

---

## 🔵 Backend Dev 1 (B1): Publisher & Stall Management

### Your Files
```
src/main/java/com/bookfair/
├── controller/
│   ├── PublisherController.java  ← YOUR FILE
│   └── StallController.java      ← YOUR FILE
├── service/
│   ├── PublisherService.java     ← YOUR FILE
│   └── StallService.java         ← YOUR FILE
├── dto/
│   └── PublisherRequest.java     ← YOUR FILE
└── entity/
    ├── Publisher.java            ← Reference only
    └── Stall.java                ← Reference only
```

### Your Tasks
- [ ] **Add validation to PublisherRequest**
  ```java
  // In PublisherRequest.java, add:
  import jakarta.validation.constraints.*;
  
  @NotBlank(message = "Business name is required")
  private String businessName;
  
  @Email(message = "Invalid email format")
  @NotBlank(message = "Email is required")
  private String email;
  
  @NotBlank(message = "Contact person is required")
  private String contactPerson;
  ```

- [ ] **Add @Valid to controller**
  ```java
  @PostMapping
  public ResponseEntity<Publisher> register(@Valid @RequestBody PublisherRequest request) {
  ```

- [ ] **Add duplicate email check in PublisherService**
  ```java
  public Publisher register(PublisherRequest request) {
      if (publisherRepository.findByEmail(request.getEmail()).isPresent()) {
          throw new RuntimeException("Email already registered");
      }
      // ... rest of code
  }
  ```

- [ ] **Add stall filtering by size**
  ```java
  // In StallController.java
  @GetMapping
  public ResponseEntity<List<Stall>> getAll(@RequestParam(required = false) String size) {
      if (size != null) {
          return ResponseEntity.ok(stallService.getBySize(Stall.StallSize.valueOf(size)));
      }
      return ResponseEntity.ok(stallService.getAll());
  }
  
  // In StallService.java - add new method
  // In StallRepository.java - add: List<Stall> findBySize(Stall.StallSize size);
  ```

### How to Test Your Work
```bash
# Start the server
mvn spring-boot:run

# Test registration
curl -X POST http://localhost:8080/api/publishers \
  -H "Content-Type: application/json" \
  -d '{"businessName":"Test","email":"test@test.com","contactPerson":"John"}'

# Test validation (should fail)
curl -X POST http://localhost:8080/api/publishers \
  -H "Content-Type: application/json" \
  -d '{"businessName":"","email":"invalid","contactPerson":""}'

# Test stall filtering
curl "http://localhost:8080/api/stalls?size=SMALL"
```

### AI Prompt Template
> "I'm working on a Spring Boot controller. I need to add validation to my DTO class PublisherRequest with fields businessName, email, contactPerson. Show me how to use Jakarta validation annotations and handle validation errors."

---

## 🟢 Backend Dev 2 (B2): Reservation, Email & QR

### Your Files
```
src/main/java/com/bookfair/
├── controller/
│   └── ReservationController.java  ← YOUR FILE
├── service/
│   ├── ReservationService.java     ← YOUR FILE
│   ├── EmailService.java           ← YOUR FILE (implement)
│   └── QrService.java              ← YOUR FILE (implement)
└── dto/
    └── ReservationRequest.java     ← Reference only
```

### Your Tasks
- [ ] **Implement QR Code Generation**
  ```java
  // In QrService.java
  import com.google.zxing.BarcodeFormat;
  import com.google.zxing.client.j2se.MatrixToImageWriter;
  import com.google.zxing.qrcode.QRCodeWriter;
  import java.io.ByteArrayOutputStream;
  
  public byte[] generateQrCode(String content) {
      try {
          QRCodeWriter writer = new QRCodeWriter();
          var matrix = writer.encode(content, BarcodeFormat.QR_CODE, 200, 200);
          ByteArrayOutputStream out = new ByteArrayOutputStream();
          MatrixToImageWriter.writeToStream(matrix, "PNG", out);
          return out.toByteArray();
      } catch (Exception e) {
          throw new RuntimeException("Failed to generate QR", e);
      }
  }
  ```

- [ ] **Implement Email Service** (use console logging for now)
  ```java
  // For testing without actual email:
  public void sendConfirmation(String toEmail, List<Reservation> reservations) {
      System.out.println("========== EMAIL ==========");
      System.out.println("To: " + toEmail);
      System.out.println("Subject: Bookfair Reservation Confirmed!");
      System.out.println("Body: You have reserved " + reservations.size() + " stall(s)");
      reservations.forEach(r -> {
          System.out.println("  Stall: " + r.getStall().getName());
          System.out.println("  QR: " + r.getQrCode());
      });
      System.out.println("===========================");
  }
  ```

- [ ] **Add Global Exception Handler**
  ```java
  // Create new file: src/.../config/GlobalExceptionHandler.java
  @RestControllerAdvice
  public class GlobalExceptionHandler {
      
      @ExceptionHandler(RuntimeException.class)
      public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException e) {
          return ResponseEntity.badRequest()
              .body(Map.of("error", e.getMessage()));
      }
  }
  ```

- [ ] **Add QR download endpoint**
  ```java
  // In ReservationController
  @GetMapping("/{id}/qr")
  public ResponseEntity<byte[]> getQrCode(@PathVariable Long id) {
      Reservation res = reservationService.getById(id);
      byte[] qr = qrService.generateQrCode(res.getQrCode());
      return ResponseEntity.ok()
          .header("Content-Type", "image/png")
          .body(qr);
  }
  ```

### How to Test
```bash
# Create a reservation first (need publisher ID 1)
curl -X POST http://localhost:8080/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"publisherId":1,"stallIds":[1,2]}'

# Check console for "EMAIL" log output

# Download QR (opens in browser)
# http://localhost:8080/api/reservations/1/qr
```

### AI Prompt Template
> "I need to implement email sending in Spring Boot using JavaMailSender. The email should include an attached QR code PNG image. Show me how to create a MimeMessage with an inline image attachment."

---

## 🟣 Backend Dev 3 (B3): Genre & Employee Portal

### Your Files
```
src/main/java/com/bookfair/
├── controller/
│   ├── GenreController.java        ← YOUR FILE
│   └── EmployeeController.java     ← CREATE THIS
├── service/
│   └── GenreService.java           ← YOUR FILE
└── dto/
    ├── GenreRequest.java           ← YOUR FILE
    └── DashboardStats.java         ← CREATE THIS
```

### Your Tasks
- [ ] **Add bulk genre creation**
  ```java
  // In GenreController.java
  @PostMapping("/bulk")
  public ResponseEntity<List<Genre>> addBulk(@RequestBody List<GenreRequest> requests) {
      List<Genre> genres = requests.stream()
          .map(genreService::addGenre)
          .toList();
      return ResponseEntity.ok(genres);
  }
  ```

- [ ] **Create Employee Dashboard DTO**
  ```java
  // New file: dto/DashboardStats.java
  @Data
  @AllArgsConstructor
  public class DashboardStats {
      private long totalStalls;
      private long reservedStalls;
      private long availableStalls;
      private long totalPublishers;
      private long totalReservations;
  }
  ```

- [ ] **Create EmployeeController**
  ```java
  // New file: controller/EmployeeController.java
  @RestController
  @RequestMapping("/api/employee")
  @RequiredArgsConstructor
  public class EmployeeController {
      
      private final StallRepository stallRepository;
      private final PublisherRepository publisherRepository;
      private final ReservationRepository reservationRepository;
      
      @GetMapping("/stats")
      public ResponseEntity<DashboardStats> getStats() {
          long total = stallRepository.count();
          long reserved = stallRepository.findByReservedTrue().size();
          return ResponseEntity.ok(new DashboardStats(
              total,
              reserved,
              total - reserved,
              publisherRepository.count(),
              reservationRepository.count()
          ));
      }
      
      @GetMapping("/reservations")
      public ResponseEntity<List<Reservation>> getAllReservations() {
          return ResponseEntity.ok(reservationRepository.findAll());
      }
  }
  ```

### How to Test
```bash
# Add multiple genres at once
curl -X POST http://localhost:8080/api/genres/bulk \
  -H "Content-Type: application/json" \
  -d '[{"publisherId":1,"name":"Fiction"},{"publisherId":1,"name":"Children"}]'

# Get dashboard stats
curl http://localhost:8080/api/employee/stats
```

### AI Prompt Template
> "I need to create an admin dashboard endpoint in Spring Boot that returns statistics. I want to count records from multiple JPA repositories and return them as a DTO. Show me the controller and DTO structure."

---

# 👩‍💻 FRONTEND TEAM

---

## 🔴 Frontend Dev 1 (F1): Registration Page

### Your Files
```
src/
├── pages/
│   └── RegisterPage.tsx     ← YOUR MAIN FILE
├── components/
│   ├── Input.tsx            ← CREATE THIS
│   ├── Button.tsx           ← CREATE THIS
│   └── FormError.tsx        ← CREATE THIS
```

### Your Tasks
- [ ] **Create reusable Input component**
  ```tsx
  // src/components/Input.tsx
  interface InputProps {
    label: string
    type?: string
    value: string
    onChange: (value: string) => void
    error?: string
    required?: boolean
  }
  
  export function Input({ label, type = 'text', value, onChange, error, required }: InputProps) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    )
  }
  ```

- [ ] **Add form validation**
  ```tsx
  // In RegisterPage.tsx
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.businessName.trim()) newErrors.businessName = 'Required'
    if (!form.email.trim()) newErrors.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email'
    if (!form.contactPerson.trim()) newErrors.contactPerson = 'Required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    mutation.mutate(form)
  }
  ```

- [ ] **Improve styling** - Make it visually appealing with:
  - Gradient background
  - Card with shadow
  - Animated button
  - Loading spinner

### Design Reference
```
┌──────────────────────────────────────┐
│                                      │
│   🎪 Colombo International Bookfair  │
│       Stall Reservation Portal       │
│                                      │
│   ┌──────────────────────────────┐   │
│   │  Business Name *             │   │
│   │  ┌────────────────────────┐  │   │
│   │  │                        │  │   │
│   │  └────────────────────────┘  │   │
│   │                              │   │
│   │  Email *                     │   │
│   │  ┌────────────────────────┐  │   │
│   │  │                        │  │   │
│   │  └────────────────────────┘  │   │
│   │                              │   │
│   │  Contact Person *            │   │
│   │  ┌────────────────────────┐  │   │
│   │  │                        │  │   │
│   │  └────────────────────────┘  │   │
│   │                              │   │
│   │  ┌────────────────────────┐  │   │
│   │  │   Register & Continue  │  │   │
│   │  └────────────────────────┘  │   │
│   └──────────────────────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

### AI Prompt Template
> "I'm building a registration form in React with TypeScript and Tailwind CSS. I need to create a reusable Input component with validation, error states, and a loading spinner. The form should have a modern gradient design. Show me the component code."

---

## 🟠 Frontend Dev 2 (F2): Stall Map & Reservation

### Your Files
```
src/
├── pages/
│   └── StallMapPage.tsx           ← YOUR MAIN FILE
├── components/
│   ├── StallCard.tsx              ← CREATE THIS
│   ├── StallMap.tsx               ← CREATE THIS
│   ├── ConfirmModal.tsx           ← CREATE THIS
│   └── SizeLegend.tsx             ← CREATE THIS
```

### Your Tasks
- [ ] **Create StallCard component**
  ```tsx
  // src/components/StallCard.tsx
  interface StallCardProps {
    stall: Stall
    isSelected: boolean
    onSelect: () => void
  }
  
  const sizeColors = {
    SMALL: 'bg-green-100 border-green-400',
    MEDIUM: 'bg-blue-100 border-blue-400',
    LARGE: 'bg-purple-100 border-purple-400',
  }
  
  export function StallCard({ stall, isSelected, onSelect }: StallCardProps) {
    if (stall.reserved) {
      return (
        <div className="p-3 bg-gray-200 border-2 border-gray-400 rounded opacity-50 cursor-not-allowed">
          <div className="font-bold text-gray-500">{stall.name}</div>
          <div className="text-xs text-gray-400">Reserved</div>
        </div>
      )
    }
    
    return (
      <div
        onClick={onSelect}
        className={`p-3 rounded cursor-pointer border-2 transition-all
          ${isSelected 
            ? 'bg-blue-500 text-white border-blue-700 scale-105' 
            : sizeColors[stall.size]
          }
          hover:scale-105`}
      >
        <div className="font-bold">{stall.name}</div>
        <div className="text-xs">{stall.size}</div>
      </div>
    )
  }
  ```

- [ ] **Create proper grid-based map**
  ```tsx
  // The grid should be 5 columns (A-E) x 4 rows (1-4)
  // Use stall.positionX and positionY to place stalls
  <div className="grid grid-cols-5 gap-3 p-6 bg-gray-50 rounded-xl">
    {stalls?.map((stall) => (
      <StallCard
        key={stall.id}
        stall={stall}
        isSelected={selectedStalls.includes(stall.id)}
        onSelect={() => toggleStall(stall.id)}
      />
    ))}
  </div>
  ```

- [ ] **Create ConfirmModal component**
  ```tsx
  // src/components/ConfirmModal.tsx
  interface ConfirmModalProps {
    isOpen: boolean
    selectedCount: number
    onConfirm: () => void
    onCancel: () => void
    isLoading: boolean
  }
  
  export function ConfirmModal({ isOpen, selectedCount, onConfirm, onCancel, isLoading }: ConfirmModalProps) {
    if (!isOpen) return null
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
          <h2 className="text-xl font-bold mb-4">Confirm Reservation</h2>
          <p className="text-gray-600 mb-6">
            You are about to reserve <span className="font-bold">{selectedCount}</span> stall(s).
            A confirmation email with QR code will be sent to you.
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Reserving...' : 'Confirm Reservation'}
            </button>
          </div>
        </div>
      </div>
    )
  }
  ```

- [ ] **Add selection limit feedback**
  ```tsx
  {selectedStalls.length >= 3 && (
    <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg mb-4">
      ⚠️ Maximum 3 stalls per business. Deselect one to choose another.
    </div>
  )}
  ```

### Design Reference
```
┌─────────────────────────────────────────────────────────────────┐
│  Stall Reservation Map          🟢 Small 🔵 Medium 🟣 Large    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                      │
│   │ A1  │ │ A2  │ │ A3  │ │ A4  │ │ A5  │   Row A              │
│   │ 🟢  │ │ 🟣  │ │ ▓▓▓ │ │ 🔵  │ │ ✓🔵 │   (▓ = reserved)     │
│   └─────┘ └─────┘ └─────┘ └─────┘ └─────┘   (✓ = selected)     │
│                                                                 │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                      │
│   │ B1  │ │ B2  │ │ B3  │ │ B4  │ │ B5  │   Row B              │
│   │ ▓▓▓ │ │ 🟢  │ │ 🟣  │ │ ✓🟢 │ │ 🔵  │                      │
│   └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                      │
│                                                                 │
│                    [ Reserve 2 Stalls ]                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### AI Prompt Template
> "I'm building an interactive stall selection map in React with TypeScript. Users can click stalls to select them (max 3). I need a grid layout with color coding by size, disabled state for reserved stalls, and a confirmation modal. Show me the component structure."

---

## 🟡 Frontend Dev 3 (F3): Home Page & Employee Portal

### Your Files
```
src/
├── pages/
│   ├── HomePage.tsx              ← YOUR FILE
│   └── EmployeePortalPage.tsx    ← YOUR FILE
├── components/
│   ├── ReservationCard.tsx       ← CREATE THIS
│   ├── GenreTag.tsx              ← CREATE THIS
│   ├── StatsCard.tsx             ← CREATE THIS
│   └── DataTable.tsx             ← CREATE THIS
```

### Your Tasks
- [ ] **Add QR code display** (install library first)
  ```bash
  npm install qrcode.react
  ```
  ```tsx
  // In HomePage.tsx
  import { QRCodeSVG } from 'qrcode.react'
  
  // In reservation card:
  <QRCodeSVG value={reservation.qrCode} size={100} />
  ```

- [ ] **Create ReservationCard**
  ```tsx
  // src/components/ReservationCard.tsx
  import { QRCodeSVG } from 'qrcode.react'
  import type { Reservation } from '../types'
  
  export function ReservationCard({ reservation }: { reservation: Reservation }) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-2xl font-bold text-blue-600">{reservation.stall.name}</div>
            <div className="text-gray-500">{reservation.stall.size} Stall</div>
          </div>
          <QRCodeSVG value={reservation.qrCode} size={80} />
        </div>
        <div className="mt-3 text-xs text-gray-400">
          Reserved on {new Date(reservation.createdAt).toLocaleDateString()}
        </div>
      </div>
    )
  }
  ```

- [ ] **Create StatsCard for Employee Portal**
  ```tsx
  // src/components/StatsCard.tsx
  interface StatsCardProps {
    title: string
    value: number
    color: 'blue' | 'green' | 'red' | 'purple'
    icon?: string
  }
  
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  }
  
  export function StatsCard({ title, value, color, icon }: StatsCardProps) {
    return (
      <div className={`p-6 rounded-xl ${colorClasses[color]}`}>
        <div className="text-sm font-medium opacity-80">{title}</div>
        <div className="text-3xl font-bold mt-1">{value}</div>
      </div>
    )
  }
  ```

- [ ] **Add search/filter to DataTable**
  ```tsx
  const [search, setSearch] = useState('')
  
  const filteredReservations = reservations?.filter(res =>
    res.publisher.businessName.toLowerCase().includes(search.toLowerCase()) ||
    res.stall.name.toLowerCase().includes(search.toLowerCase())
  )
  ```

### Design Reference - Home Page
```
┌─────────────────────────────────────────────────────────────────┐
│  Dashboard                                Welcome, ABC Books!   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Your Reservations                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │  A5          │ │  B4          │ │              │            │
│  │  MEDIUM      │ │  SMALL       │ │   + Reserve  │            │
│  │  ┌────────┐  │ │  ┌────────┐  │ │     More     │            │
│  │  │ QR CODE│  │ │  │ QR CODE│  │ │              │            │
│  │  └────────┘  │ │  └────────┘  │ │              │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                 │
│  Literary Genres                                                │
│  ┌─────────┐ ┌───────────┐ ┌──────────┐ ┌─────────┐           │
│  │ Fiction │ │ Children  │ │ Non-Fic  │ │ +Add    │           │
│  └─────────┘ └───────────┘ └──────────┘ └─────────┘           │
│                                                                 │
│  Quick Add: [Fiction] [Children] [Educational] [Comics]        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### AI Prompt Template
> "I need to create an employee dashboard in React with statistics cards showing totals, a searchable data table, and a visual overview. I'm using TanStack Query for data fetching. Show me how to structure the components and implement search filtering."

---

## 🤖 Using AI Effectively

### Do's ✅
- Ask for specific code snippets
- Provide context (file names, existing code)
- Ask to explain patterns you don't understand
- Ask for Tailwind class suggestions

### Don'ts ❌
- Don't copy entire AI-generated files blindly
- Don't ask AI to build the whole app
- Don't ignore TypeScript errors
- Don't skip testing

### Good Prompt Examples
```
"I have this React component [paste code]. How can I add loading state using TanStack Query?"

"Explain what @RequiredArgsConstructor does in Spring Boot"

"What Tailwind classes should I use for a card with shadow and rounded corners?"

"My API call returns 400 error. Here's my controller [paste code] and request [paste curl]. What's wrong?"
```

---

## 📞 Communication

### Daily Standup Questions
1. What did I complete yesterday?
2. What will I work on today?
3. Any blockers?

### When to Ask for Help
- Stuck for more than 30 minutes
- Merge conflicts
- API integration issues
- Don't understand an error

---

**Good luck team! Build something great! 🚀**
