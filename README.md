# VidVault

Personal video library for saving, categorizing, and organizing YouTube videos with a clean YouTube-style UI.

## Features

- Save YouTube videos with auto-fetched metadata (title, thumbnail, channel)
- Auto-categorization into Study, Tech, Creative, Entertainment, Other
- Playlist creation and management
- Watch tracking (Unwatched, In Progress, Watched)
- Reminder system with scheduled notifications
- Search and filter by category
- YouTube-style dark UI

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **Backend:** Node.js, Express, Prisma ORM
- **Database:** PostgreSQL 15
- **Queue:** Redis + BullMQ
- **Containerization:** Docker Compose

## Quick Start

### Prerequisites

- Docker + Docker Compose
- Node.js 20+ (for local dev)

### Run with Docker

```bash
# Build and start all services
docker-compose up --build

# Or run detached
docker-compose up -d --build
```

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Local Development

**Backend:**
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Backend:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for JWT tokens
- `PORT` - API port (default: 5000)

## Project Structure

```
youtubeApp/
├── backend/           # Express API
│   ├── src/
│   │   ├── index.js         # Main server
│   │   ├── worker.js        # Background job worker
│   │   ├── routes/          # API routes
│   │   ├── services/        # YouTube fetch, categorization
│   │   └── lib/             # Prisma, Redis clients
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── Dockerfile
├── frontend/          # Next.js app
│   ├── src/
│   │   ├── app/             # Pages
│   │   ├── components/      # React components
│   │   └── lib/             # API client
│   └── Dockerfile
└── docker-compose.yml
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/videos | List videos |
| POST | /api/videos | Add video |
| PATCH | /api/videos/:id | Update video |
| DELETE | /api/videos/:id | Delete video |
| GET | /api/playlists | List playlists |
| POST | /api/playlists | Create playlist |
| POST | /api/playlists/:id/videos | Add video to playlist |
| GET | /api/reminders | List reminders |
| POST | /api/reminders | Create reminder |
