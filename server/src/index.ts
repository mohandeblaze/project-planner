import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import "dotenv/config";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

const app = new Hono();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN ?? [],
        allowHeaders: ["Origin", "Content-Type", "Authorization"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "DELETE", "PATCH"],
        maxAge: 600, // 10 minutes
        credentials: false,
    })
);

app.use(clerkMiddleware());

app.use(async (c, next) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
        return c.json(
            {
                message: "Unauthorized",
            },
            {
                status: 401,
            }
        );
    }

    return next();
});

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.get("/api", (c) => {
    return c.json({
        message: "Hello from API",
    });
});

const port = 8080;
console.log(`Server is running on port http://localhost:${port}`);

serve({
    fetch: app.fetch,
    port,
});
