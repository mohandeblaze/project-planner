import { Hono } from "hono";
import { clerkUserMiddleware } from "../middleware/clerkUserMiddleware";

export const topicRoute = new Hono();

topicRoute.get("/", clerkUserMiddleware, (c) => {
    return c.json({
        message: "Hello from Topic API",
    });
});
