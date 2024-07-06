import { RouterProvider, createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Import the generated route tree
import { ClientEnv } from "src/clientEnv";
import { routeTree } from "src/routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

// Import your publishable key
const PUBLISHABLE_KEY = ClientEnv.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    );
}
