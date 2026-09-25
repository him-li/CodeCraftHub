# CodeCraftHub

CodeCraftHub is a beginner-friendly full-stack application for tracking
personal learning goals. Its React and TypeScript frontend uses Tailwind CSS
and talks to a TypeScript Express REST API, which stores course data in a local
`courses.json` file. No database or user account setup is required locally.

## Features

- Create, view, update, and delete courses
- Use a responsive React learning dashboard in a browser
- Present the AI-assisted build process on a dedicated prompt journey page
- Develop with TypeScript and Tailwind CSS
- Develop the frontend with Vite and automatic reloads
- Automatically generate numeric course IDs starting at `1`
- Automatically add a `created_at` timestamp to new courses
- Validate required course fields
- Validate target dates in `YYYY-MM-DD` format
- Restrict status values to `Not Started`, `In Progress`, or `Completed`
- Create `courses.json` automatically on first startup
- Return clear JSON error responses

## Requirements

- [Node.js](https://nodejs.org/) 20.19 or later
- npm, which is included with Node.js

Check that both are installed:

```bash
node --version
npm --version
```

## Installation

1. Open a terminal and move into the project directory:

   ```bash
   cd CodeCraftHub
   ```

2. Install the project dependencies:

   ```bash
   npm install
   ```

## Running the application

### Development

Run the Vite frontend and Express API together:

```bash
npm run dev
```

Open the dashboard at:

```text
http://localhost:5173
```

The prompt engineering showcase is available at:

```text
http://localhost:5173/prompts
```

Add your real prompts and reflections in `frontend/src/content/prompts.ts`.

Vite proxies `/api` requests to the Express API at `http://localhost:5000`.

### Production-style build

Build the frontend and serve the complete application through Express:

```bash
npm start
```

The dashboard and API will be available at:

```text
http://localhost:5000
```

The `prestart` script automatically creates the optimized Vite build before the
server starts. On its first run, the application also creates `courses.json` in
the project directory. Stop the processes by pressing `Ctrl+C` in the terminal.

## Project structure

```text
CodeCraftHub/
├── server.ts              # Express API and production frontend server
├── package.json           # Shared frontend/backend commands and dependencies
├── tsconfig.json          # Backend TypeScript configuration
├── courses.json           # Runtime data; generated automatically and ignored
├── vercel.json            # Vercel build configuration
└── frontend/
    ├── index.html         # Vite entry point and dashboard
    ├── vite.config.ts     # Vite, React, Tailwind, tests, and API proxy
    ├── tsconfig.json      # Frontend TypeScript configuration
    └── src/               # React pages, prompt content, API client, and tests
```

## Testing

Run the React component tests:

```bash
npm test
```

Check both frontend and backend TypeScript:

```bash
npm run typecheck
```

## Vercel deployment

The project exports its Express application from `server.ts` and builds the
React frontend into `public/`, allowing Vercel to deploy both layers together.

> **Important:** Vercel Functions do not provide durable local filesystem
> storage. The JSON-file API is suitable for local learning, but production
> course changes may disappear between serverless invocations. Use durable
> storage such as Vercel Blob or a database before relying on production data.

## Course format

Each stored course has the following fields:

| Field | Type | Description |
| --- | --- | --- |
| `id` | Number | Automatically generated unique ID |
| `name` | String | Course name; required |
| `description` | String | Course description; required |
| `target_date` | String | Target completion date in `YYYY-MM-DD` format; required |
| `status` | String | `Not Started`, `In Progress`, or `Completed`; required |
| `created_at` | String | Automatically generated ISO timestamp |

Clients should not send `id` or `created_at` when creating a course. The API
generates them automatically.

## API endpoints

### Create a course

```http
POST /api/courses
```

Example request:

```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Node.js Fundamentals",
    "description": "Learn Node.js and REST API basics",
    "target_date": "2026-12-31",
    "status": "Not Started"
  }'
```

Example `201 Created` response:

```json
{
  "id": 1,
  "name": "Node.js Fundamentals",
  "description": "Learn Node.js and REST API basics",
  "target_date": "2026-12-31",
  "status": "Not Started",
  "created_at": "2026-09-24T18:00:00.000Z"
}
```

### Get all courses

```http
GET /api/courses
```

Example request:

```bash
curl http://localhost:5000/api/courses
```

Example response:

```json
[
  {
    "id": 1,
    "name": "Node.js Fundamentals",
    "description": "Learn Node.js and REST API basics",
    "target_date": "2026-12-31",
    "status": "Not Started",
    "created_at": "2026-09-24T18:00:00.000Z"
  }
]
```

If no courses have been added, this endpoint returns an empty array (`[]`).

### Get a specific course

```http
GET /api/courses/:id
```

Replace `:id` with the course's numeric ID:

```bash
curl http://localhost:5000/api/courses/1
```

The API returns the course or a `404 Not Found` response if it does not exist.

### Get course statistics

```http
GET /api/courses/stats
```

Example request:

```bash
curl http://localhost:5000/api/courses/stats
```

Example response:

```json
{
  "total": 3,
  "by_status": {
    "Not Started": 1,
    "In Progress": 1,
    "Completed": 1
  }
}
```

### Update a course

```http
PUT /api/courses/:id
```

`PUT` expects all four editable fields. The original `id` and `created_at`
values are preserved.

Example request:

```bash
curl -X PUT http://localhost:5000/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Node.js Fundamentals",
    "description": "Learn Node.js and build an Express REST API",
    "target_date": "2026-11-30",
    "status": "In Progress"
  }'
```

Example response:

```json
{
  "id": 1,
  "name": "Node.js Fundamentals",
  "description": "Learn Node.js and build an Express REST API",
  "target_date": "2026-11-30",
  "status": "In Progress",
  "created_at": "2026-09-24T18:00:00.000Z"
}
```

### Delete a course

```http
DELETE /api/courses/:id
```

Example request:

```bash
curl -X DELETE http://localhost:5000/api/courses/1
```

Example response:

```json
{
  "message": "Course deleted successfully",
  "course": {
    "id": 1,
    "name": "Node.js Fundamentals",
    "description": "Learn Node.js and build an Express REST API",
    "target_date": "2026-11-30",
    "status": "In Progress",
    "created_at": "2026-09-24T18:00:00.000Z"
  }
}
```

## Error responses

Errors are returned as JSON. Common HTTP status codes are:

| Status | Meaning |
| --- | --- |
| `400 Bad Request` | Missing fields, malformed JSON, invalid ID, date, or status |
| `404 Not Found` | Course or endpoint does not exist |
| `500 Internal Server Error` | The course data file could not be read or written |

Example validation error:

```json
{
  "error": "status must be one of: Not Started, In Progress, Completed"
}
```

## Troubleshooting

### `npm: command not found` or `node: command not found`

Install a current Node.js LTS release, restart the terminal, and confirm the
installation with `node --version` and `npm --version`.

### `Cannot find module 'express'`

Install dependencies from the project directory:

```bash
npm install
```

### Port 5000 is already in use

Stop the other program that is using port `5000`, then run `npm start` again.
On macOS or Linux, this command shows which process is listening on the port:

```bash
lsof -i :5000
```

### Requests return `Request body contains invalid JSON`

Check commas and quotation marks in the request body. Also include this header
when sending JSON:

```text
Content-Type: application/json
```

### A date is rejected

Use a real calendar date in `YYYY-MM-DD` format, such as `2026-12-31`. Values
such as `12/31/2026` and `2026-02-30` are invalid.

### A status is rejected

Status values are case-sensitive. Use exactly one of:

- `Not Started`
- `In Progress`
- `Completed`

### The API cannot read or write course data

Make sure the project directory is writable and `courses.json` contains a JSON
array. A valid empty file contains:

```json
[]
```

If the file contains important course data, make a backup before editing it.
