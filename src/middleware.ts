// src/middleware.ts
import { authMiddleware } from "./lib/middleware/auth-middleware";

export default authMiddleware;

export const config = {
  matcher: [
    // Only protect /dashboard and its subroutes
    "/dashboard/:path*",
  ],
};