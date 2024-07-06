import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/api(.*)"]);

const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = ["https://projects.axiomarc.com"];

const corsOptions = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function isAllowedOrigin(origin: string) {
    return isProduction ? allowedOrigins.includes(origin) : true;
}

function setCorsHeaders(response: NextResponse, origin: string) {
    if (isAllowedOrigin(origin)) {
        response.headers.set("Access-Control-Allow-Origin", origin);
    }

    Object.entries(corsOptions).forEach(([key, value]) => {
        response.headers.set(key, value);
    });
}

export default clerkMiddleware((auth, req) => {
    // Check the origin from the request
    const origin = req.headers.get("origin") ?? "";

    const isPreflight = req.method === "OPTIONS";

    if (isPreflight) {
        const preflightHeaders = {
            ...(isAllowedOrigin(origin) && { "Access-Control-Allow-Origin": origin }),
            ...corsOptions,
        };
        return NextResponse.json({}, { headers: preflightHeaders });
    }

    let response: NextResponse;
    if (isProtectedRoute(req)) {
        const authData = auth();
        const isValidAuth = authData.sessionClaims && authData.sessionId && authData.userId;

        response = isValidAuth
            ? NextResponse.next()
            : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
        response = NextResponse.next();
    }

    setCorsHeaders(response, origin);

    return response;
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
