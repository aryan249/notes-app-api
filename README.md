# Notes App API

A TypeScript REST API for managing personal notes, built with Express and PostgreSQL.

## Tech Stack

- Node.js 20 + TypeScript
- Express 5
- PostgreSQL 16
- JWT authentication
- Docker Compose
- Jest for testing

## Quick Start

### With Docker

```bash
docker compose up --build
```

The API will be available at `http://localhost:3000`.

### Without Docker

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file and configure it:

```bash
cp .env.example .env
```

3. Start a PostgreSQL instance and update `DATABASE_URL` in `.env`.

4. Run migrations:

```bash
npm run migrate
```

5. (Optional) Seed demo data:

```bash
npm run seed
```

6. Start the dev server:

```bash
npm run dev
```

## API Endpoints

### Auth

| Method | Endpoint             | Body                        | Description      |
|--------|----------------------|-----------------------------|------------------|
| POST   | `/api/auth/register` | `{ email, password }`       | Register a user  |
| POST   | `/api/auth/login`    | `{ email, password }`       | Login, get JWT   |

### Users (requires `Authorization: Bearer <token>`)

| Method | Endpoint               | Body                                 | Description         |
|--------|------------------------|--------------------------------------|---------------------|
| GET    | `/api/users/me`        |                                      | Get profile         |
| PUT    | `/api/users/me/password` | `{ currentPassword, newPassword }` | Change password     |
| DELETE | `/api/users/me`        |                                      | Delete account      |

### Notes (requires `Authorization: Bearer <token>`)

| Method | Endpoint                    | Body / Query                                     | Description          |
|--------|-----------------------------|--------------------------------------------------|----------------------|
| POST   | `/api/notes`                | `{ title, content?, tags? }`                     | Create a note        |
| GET    | `/api/notes`                | `?search=` `?tag=` `?archived=` `?page=` `?limit=` | List / search notes  |
| GET    | `/api/notes/export`         |                                                  | Export all notes     |
| GET    | `/api/notes/:id`            |                                                  | Get a single note    |
| PUT    | `/api/notes/:id`            | `{ title?, content?, tags? }`                    | Update a note        |
| DELETE | `/api/notes/:id`            |                                                  | Delete a note        |
| POST   | `/api/notes/bulk-delete`    | `{ ids: [1, 2, 3] }`                            | Bulk delete          |
| POST   | `/api/notes/:id/duplicate`  |                                                  | Duplicate a note     |
| PATCH  | `/api/notes/:id/archive`    |                                                  | Archive a note       |
| PATCH  | `/api/notes/:id/unarchive`  |                                                  | Unarchive a note     |
| PATCH  | `/api/notes/:id/pin`        |                                                  | Pin a note           |
| PATCH  | `/api/notes/:id/unpin`      |                                                  | Unpin a note         |

### Tags (requires `Authorization: Bearer <token>`)

| Method | Endpoint     | Description              |
|--------|--------------|--------------------------|
| GET    | `/api/tags`  | List all unique tags     |

### Stats (requires `Authorization: Bearer <token>`)

| Method | Endpoint      | Description                     |
|--------|---------------|---------------------------------|
| GET    | `/api/stats`  | Note counts (total/active/archived/pinned) |

### Health

| Method | Endpoint   | Description                     |
|--------|------------|---------------------------------|
| GET    | `/health`  | Health check with DB status     |

## Example Requests

Register:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secret123"}'
```

Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secret123"}'
```

Create a note:
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title": "My Note", "content": "Hello world", "tags": ["personal"]}'
```

Search notes:
```bash
curl "http://localhost:3000/api/notes?search=hello&page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

Filter by tag:
```bash
curl "http://localhost:3000/api/notes?tag=personal" \
  -H "Authorization: Bearer <token>"
```

## Scripts

| Command          | Description                      |
|------------------|----------------------------------|
| `npm run dev`    | Start dev server with hot reload |
| `npm run build`  | Compile TypeScript to JS         |
| `npm start`      | Run compiled JS                  |
| `npm run migrate`| Run database migrations          |
| `npm run seed`   | Seed demo data                   |
| `npm test`       | Run tests                        |
| `npm run lint`   | Run ESLint                       |

## Project Structure

```
src/
  config/         Centralized environment config
  controllers/    Route handlers
  db/             Database pool, migrations, and seeder
  middleware/     Auth, validation, rate limiting, error handling
  routes/         Express route definitions
  types/          TypeScript type definitions
  index.ts        App entry point
```

## Environment Variables

| Variable         | Default                                          | Description              |
|------------------|--------------------------------------------------|--------------------------|
| `PORT`           | `3000`                                           | Server port              |
| `NODE_ENV`       | `development`                                    | Environment mode         |
| `DATABASE_URL`   | `postgresql://postgres:postgres@localhost:5432/notes_db` | PostgreSQL connection string |
| `JWT_SECRET`     | —                                                | JWT signing secret       |
| `JWT_EXPIRES_IN` | `7d`                                             | Token expiration         |
| `BCRYPT_ROUNDS`  | `10`                                             | Password hashing rounds  |
