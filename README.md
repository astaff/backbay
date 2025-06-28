# Back Bay: Minimalist train schedule display

A real alternative to aging digital signage solutions.

1. Web page that displays train schedule for a station ID (i.e. `http://localhost:3000/view/BBY`)
2. A Linux box that boots up and displays the page for a given station ID

## Requirements

1. GNU Make
2. Node.js LTS
3. (optional) CloudFlare account for hosting

## Quick Start

### Schedule Page

```bash
make install    # Install dependencies
make test       # Run tests
make dev        # Start development servers
make deploy     # Deploy to ClouldFlare
```

### Display Image

```bash
cd display/
make build
```

See [Display README](display/README.md) for details.

## Architecture

- **Backend**: Hono.js API server on port 3000
- **Frontend**: React + Vite client with proxy to backend
- **[Display](display/README.md)**: Raspberry Pi Image that opens a pre-defined URL in a full-screen browser

## API

```bash
GET /api/train/schedule/:stationId
```

Returns train schedule with track, times, destinations, and delays.

## Deployment

**CloudFlare**
```bash
make deploy
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
