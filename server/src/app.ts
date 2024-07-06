import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { AppEnv } from "./appEnv";
import { topicRoute } from "./routes/topicRoute";

const app = new Hono();

app.use("*", logger());

app.use(
    cors({
        origin: AppEnv.CORS_ORIGIN,
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
        return c.json({ message: "Unauthorized" }, 401);
    }

    return next();
});

const apiRoutes = app.basePath("/").route("/topics", topicRoute);

app.use("*", async (c) => {
    return c.json({ message: "Not Found" }, 404);
});

export default app;
export type ApiRoutes = typeof apiRoutes;
