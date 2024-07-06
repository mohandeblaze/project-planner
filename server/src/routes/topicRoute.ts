import { clerkUserMiddleware } from "@/middleware/clerkUserMiddleware";
import { Hono } from "hono";

export const topicRoute = new Hono();

topicRoute.get("/", clerkUserMiddleware, (c) => {
    return c.json({
        topics: [
            {
                id: "1",
                title: "Topic 1",
                description: "Description 1",
            },
            {
                id: "2",
                title: "Topic 2",
                description: "Description 2",
            },
        ],
    });
});
