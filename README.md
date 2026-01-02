# Tournament Aggregator - Complete Setup Guide

A full-stack web application for managing and displaying live gaming tournaments.

## 📋 Project Structure

```
landing/
├── backend/
│   ├── main.py                 # FastAPI application with models & endpoints
│   ├── requirements.txt        # Python dependencies
│   └── .env.example           # Environment variables template
│
└── frontend/
    ├── app/
    │   ├── layout.tsx         # Root layout with Query Provider
    │   ├── page.tsx           # Public tournaments page
    │   ├── globals.css        # Global styles with animations
    │   └── admin/
    │       └── page.tsx       # Protected admin dashboard
    │
    ├── components/
    │   ├── TournamentCard.tsx # Card component with live indicator
    │   ├── TournamentModal.tsx # Add/Edit tournament form
    │   └── Gatekeeper.tsx     # Auth guard component
    │
    ├── lib/
    │   ├── api.ts            # API client with axios
    │   ├── hooks.ts          # React Query hooks
    │   └── query-provider.tsx # Query Client setup
    │
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── next.config.mjs
    └── .env.local            # Local environment file
```

## 🎯 Features

### Backend (FastAPI)
- ✅ SQLite database with SQLAlchemy ORM
- ✅ Pydantic models for validation
- ✅ CRUD endpoints for tournaments
- ✅ Tournament status: LIVE, UPCOMING, COMPLETED
- ✅ CORS enabled for frontend communication
- ✅ Auto-sorted endpoints (LIVE tournaments first)

### Frontend (Next.js)
- ✅ Public page with responsive grid layout
- ✅ Auto-refresh every 30 seconds with React Query
- ✅ Live tournament indicator with pulsing animation
- ✅ Protected admin dashboard with login
- ✅ Add/Edit/Delete tournament management
- ✅ Data table view for admins
- ✅ Tailwind CSS styling with dark theme

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- pnpm (or npm/yarn)

### Backend Setup

1. **Install Python dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Run the FastAPI server:**
```bash
python main.py
```

The backend will start at `http://localhost:8000`

You can check the API docs at: `http://localhost:8000/docs`

### Frontend Setup

1. **Install Node dependencies:**
```bash
cd frontend
pnpm install
```

2. **Run the development server:**
```bash
pnpm run dev
```

The frontend will start at `http://localhost:3000`

### Running Both Concurrently

**Option 1: Two Terminal Windows**
```bash
# Terminal 1 - Backend
cd backend
python main.py

# Terminal 2 - Frontend
cd frontend
pnpm run dev
```

**Option 2: Using a Script (macOS/Linux)**

Create a file named `run.sh`:
```bash
#!/bin/bash
cd backend
python main.py &
BACKEND_PID=$!

cd ../frontend
pnpm run dev &
FRONTEND_PID=$!

echo "Backend (PID: $BACKEND_PID) running on http://localhost:8000"
echo "Frontend (PID: $FRONTEND_PID) running on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

wait
```

Then run:
```bash
chmod +x run.sh
./run.sh
```

**Option 3: Using concurrently (if installed)**
```bash
pnpm add -D concurrently
```

Add to `package.json`:
```json
{
  "scripts": {
    "dev:backend": "cd ../backend && python main.py",
    "dev:frontend": "next dev",
    "dev": "concurrently \"pnpm dev:backend\" \"pnpm dev:frontend\""
  }
}
```

## 🔐 Admin Authentication

**Credentials:**
- Username: `admin`
- Password: `1234`

Access the admin panel: `http://localhost:3000/admin`

### How It Works
1. SessionStorage-based authentication (client-side)
2. Login form stores auth flag in sessionStorage
3. Routes check authentication on mount
4. Logout clears the auth flag

## 📡 API Endpoints

### GET /tournaments
Fetch all tournaments (sorted by LIVE status first)
```bash
curl http://localhost:8000/tournaments
```

### POST /tournaments
Create a new tournament
```bash
curl -X POST http://localhost:8000/tournaments \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Valorant Championship",
    "game_name": "Valorant",
    "stream_url": "https://twitch.tv/example",
    "image_url": "https://example.com/image.jpg",
    "status": "LIVE",
    "start_time": "2024-01-10T15:00:00"
  }'
```

### PUT /tournaments/{id}
Update a tournament
```bash
curl -X PUT http://localhost:8000/tournaments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "COMPLETED"
  }'
```

### DELETE /tournaments/{id}
Delete a tournament
```bash
curl -X DELETE http://localhost:8000/tournaments/1
```

### GET /health
Health check
```bash
curl http://localhost:8000/health
```

## 📚 Database

The SQLite database (`tournaments.db`) is created automatically on first run.

**Tournament Table:**
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| title | String | Tournament name |
| game_name | String | Game title (e.g., Valorant) |
| stream_url | String | Stream URL |
| image_url | String | Image URL |
| status | Enum | LIVE, UPCOMING, COMPLETED |
| start_time | DateTime | Start date/time |

## 🎨 UI Components

### TournamentCard
- Displays tournament information
- Shows live indicator with pulsing animation
- Opens stream in new tab on click

### TournamentModal
- Add new tournament form
- Edit existing tournament
- Form validation

### Gatekeeper
- Login form for admin access
- SessionStorage-based authentication
- Error handling for invalid credentials

## 🔄 Auto-Refresh

The public page automatically refetches tournament data every 30 seconds using React Query.

To adjust the interval, edit [lib/hooks.ts](lib/hooks.ts):
```typescript
export function useTournaments() {
  return useQuery({
    queryKey: TOURNAMENTS_KEY,
    queryFn: tournamentAPI.getAll,
    refetchInterval: 30000, // Change this value (in milliseconds)
  });
}
```

## 🎬 Sample Data

You can add sample tournaments through the admin panel or via API:

```bash
curl -X POST http://localhost:8000/tournaments \
  -H "Content-Type: application/json" \
  -d '{
    "title": "ESL Pro League Finals",
    "game_name": "Counter-Strike 2",
    "stream_url": "https://twitch.tv/esl_csgo",
    "image_url": "https://via.placeholder.com/400x300?text=ESL+Pro+League",
    "status": "LIVE",
    "start_time": "2024-01-15T20:00:00"
  }'
```

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Ensure backend is running on `http://localhost:8000`
- Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000`
- Check CORS is enabled in `main.py`

### Database errors
- Delete `backend/tournaments.db` to reset the database
- Run backend again to recreate tables

### Port conflicts
- Backend: Change port in `main.py` (uvicorn.run(..., port=8001))
- Frontend: Use `pnpm run dev -- -p 3001`

## 📦 Technologies Used

**Backend:**
- FastAPI - Modern Python web framework
- SQLAlchemy - ORM for database
- Pydantic - Data validation
- Uvicorn - ASGI server

**Frontend:**
- Next.js 15 - React framework
- React 19 - UI library
- React Query 5.51 - Data fetching & caching
- Tailwind CSS 4 - Utility-first CSS
- Lucide React - Icon library
- Axios - HTTP client

## 📝 Environment Variables

Create `.env.local` in frontend folder:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Create `.env` in backend folder (optional):
```
DATABASE_URL=sqlite:///./tournaments.db
FASTAPI_ENV=development
```

## 🔒 Security Notes

This is a demo application with hardcoded credentials. For production:
- ✅ Use proper JWT authentication
- ✅ Store passwords securely (hashed)
- ✅ Use environment variables for secrets
- ✅ Implement proper CORS policies
- ✅ Add rate limiting
- ✅ Use HTTPS

## 📄 License

MIT License

## 🤝 Support

For issues or questions, please check the code comments and error messages in the browser console and backend logs.
