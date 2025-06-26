# BackBay

Modern TypeScript full-stack application for train schedule management.

## Quick Start

```bash
make install    # Install dependencies
make test       # Run tests (✓ 2 tests passing)
make dev        # Start development servers
```

## Architecture

- **Backend**: Hono.js API server on port 3000
- **Frontend**: React + Vite client with proxy to backend
- **Shared**: TypeScript types between client/server
- **Testing**: Vitest for fast unit tests

## API

```bash
GET /api/train/schedule/:stationId
```

Returns train schedule with track, times, destinations, and delays.

## Deployment

**CloudFlare Workers**
```bash
npx wrangler deploy
```

**Val.town**
```bash
# Use val.ts as entry point
```

## Development

```bash
make dev        # Start both client (5173) and server (3000)
make build      # Build for production
make typecheck  # TypeScript validation
make lint       # Code linting
```

All commands work as expected. TypeScript compilation clean. Tests passing.