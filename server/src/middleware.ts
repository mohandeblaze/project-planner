import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware((auth, req) => {
    if (!isProtectedRoute(req)) {
        return;
    }

    const authData = auth();
    if (authData.sessionClaims == null || authData.sessionId == null || authData.userId == null) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
