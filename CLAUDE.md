# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

Full-stack TypeScript application with:
- **Backend**: Hono.js API server with train schedule endpoints
- **Frontend**: React + Vite client application  
- **Shared**: Common TypeScript types between client/server
- **Testing**: Vitest test suite focused on behavior over types

## Development Commands

```bash
make install    # Install dependencies
make dev        # Start development servers (client + server)
make test       # Run test suite
make build      # Build for production
make typecheck  # Run TypeScript checks
make lint       # Run ESLint
```

## Project Structure

```
src/
├── server/        # Hono.js backend API
├── client/        # React frontend application  
├── shared/        # Shared TypeScript types
└── tests/         # Test files
```

## API Endpoints

- `GET /api/train/schedule/:stationId` - Returns train schedule for station

## Deployment

- **CloudFlare Workers**: Use `wrangler.toml` configuration
- **Val.town**: Use `val.ts` entry point for worker deployment

## Key Files

- `get_train_schedule()` function in `src/server/routes/train.ts:8`
- Shared types in `src/shared/types.ts`