import { ServerEnv } from "@/serverEnv";
import { cors } from "hono/cors";

export const corsMiddleware = cors({
    origin: ServerEnv.CORS_ORIGIN,
    allowHeaders: ["Origin", "Content-Type", "Authorization"],
    allowMethods: ["OPTIONS", "GET", "POST", "PUT", "DELETE", "PATCH"],
    maxAge: 600, // 10 minutes
    credentials: false,
});
