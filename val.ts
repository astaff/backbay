// Val.town deployment configuration
import { trainRoutes } from "./src/server/routes/train"

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url)
  
  if (url.pathname.startsWith("/api/train")) {
    // Handle train API routes
    const app = new Hono()
    app.route("/api/train", trainRoutes)
    return app.fetch(request)
  }
  
  // Serve static files or return 404
  return new Response("Not found", { status: 404 })
}