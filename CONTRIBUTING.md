# Team Collaboration Guide
> Master reference for all team members. Read this FULLY before starting work.
> make sure to continue working referring to the proposed API implementation. Make sure you are using



## 📋 Quick Reference

| Command | What it does |
|---------|--------------|
| `git clone <url>` | Download the repo to your computer |
| `git checkout backend` | Switch to backend branch |
| `git checkout frontend` | Switch to frontend branch |
| `git pull origin <branch>` | Get latest changes from remote |
| `git add .` | Stage all your changes |
| `git commit -m "message"` | Save changes locally with a message |
| `git push origin <branch>` | Upload your changes to GitHub |

---

## 🚀 Getting Started (First Time Setup)

### Step 1: Clone the Repository
```bash
git clone https://github.com/StereoSachiiii/SA_PROJECT.git
cd SA_PROJECT
```

### Step 2: Switch to Your Branch
**Backend developers:**
ramesh, sachin, nihad
```bash
git checkout backend
```

**Frontend developers:**
nethmi, anushka, dilum
```bash
git checkout frontend
```

### Step 3: Setup Your Environment

**Backend (Java/Spring Boot):**
1. Install Java 17+ (https://adoptium.net/)
2. Install Maven (or use IDE's built-in Maven)
3. Open folder in IntelliJ IDEA or VS Code
4. Run: `mvn spring-boot:run`
5. API runs at: http://localhost:8080

**Frontend (React/Vite):**
1. Install Node.js 18+ (https://nodejs.org/)
2. Run: `npm install`
3. Run: `npm run dev`
4. Opens at: http://localhost:5173

---

## 📁 Project Structure

### Backend (`backend` branch)
```
src/main/java/com/bookfair/
├── controller/     ← REST API endpoints (Dev 1, 2, 3)
├── service/        ← Business logic (Dev 1, 2, 3)
├── repository/     ← Database access (Done)
├── entity/         ← Database models (Done)
├── dto/            ← Request/Response objects (Done)
└── config/         ← App configuration (Done)
```

### Frontend (`frontend` branch)
```
src/
├── api/            ← Axios API calls
├── components/     ← Reusable UI pieces
├── pages/          ← Full page components
├── hooks/          ← TanStack Query hooks
└── types/          ← TypeScript types
```

---

## 👥 Team Assignments

### Backend team will have be using a private group.

### Frontend Team
| Developer | Responsibility | Pages |
|-----------|----------------|-------|
| **Dev 1** | Registration Flow | `RegisterPage.tsx` |
| **Dev 2** | Stall Map + Reservation | `StallMapPage.tsx`, `ReservationConfirmModal.tsx` |
| **Dev 3** | Home + Employee Portal | `HomePage.tsx`, `EmployeePortalPage.tsx` |

---

## 🔄 Daily Workflow

### Before Starting Work Each Day
```bash
# 1. Go to your project folder
cd SA_PROJECT

# 2. Get latest changes
git pull origin backend    # or frontend
```

### While Working
1. Make your changes
2. Test them locally
3. Commit frequently (every feature/fix):
```bash
git add .
git commit -m "Add: publication registration form"
```

# MAKE SURE TO WRITE TESTS

### When Done for the Day
```bash
git push origin backend    # or frontend
```

---

## 📝 Commit Message Format

Use this format: `Type: Short description`

**Types:**
- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Change to existing feature
- `Refactor:` Code cleanup (no behavior change)
- `Docs:` Documentation only

**Examples:**
```
Add: publisher registration endpoint
Fix: stall reservation count validation
Update: change max stalls from 3 to 5
```

---

# ⚠️ IMPORTANT RULES(ALWAYS REMEMBER EVERYONE)

### DO ✅
- Pull before starting work each day
- Commit frequently with clear messages
- Test your code before pushing
- Ask in group chat if stuck

### DON'T ❌
- Push to `main` branch directly
- Work on files assigned to other developers
- Push broken/untested code
- Wait until deadline to push all work

---

## 🔀 Merging to Main (Reviewers Only)

Only the project lead merges to main:

```bash
# Get latest main
git checkout main
git pull origin main

# Merge backend
git merge backend
git push origin main

# Merge frontend
git merge frontend
git push origin main
```



## 🆘 Common Issues


### "Merge conflict"
→ Don't panic! Ask sachin or nihad  for help, Although you don't have to always do the merging yourself.. just message sachin or nihad after commiting your changes to you branch then we will take a look.
if your local repo has a bunch of commits that are small make sure to squash them before pushing to remote.. 


---

## make sure to make the code modular always push abstractions up and implementations down so we can switch things up easily. And yeah plz never force push to main.

