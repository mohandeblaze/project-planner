import { getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";

export const authMiddleware = createMiddleware(async (c, next) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
        return c.json({ message: "Unauthorized" }, 401);
    }

    return next();
});
