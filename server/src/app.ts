import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { authMiddleware } from "./middleware/authMiddleware";
import { corsMiddleware } from "./middleware/corsMiddleware";
import { topicRoute } from "./routes/topicRoute";

const app = new Hono();

app.use("*", logger());
app.use(corsMiddleware);
app.use(clerkMiddleware());
app.use(authMiddleware);

const apiRoutes = app.basePath("/api").route("/topics", topicRoute);

// fallback route
app.use("*", async (c) => {
    return c.json({ message: "Not Found" }, 404);
});

export default app;
export type ApiRoutes = typeof apiRoutes;
