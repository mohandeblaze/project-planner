'use client';

import {
    ClerkProvider,
    SignedOut,
    SignInButton,
    SignedIn,
    UserButton,
    SignOutButton,
} from "@clerk/nextjs";

export default function Login() {
    return (
        <ClerkProvider>
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                    }}
                >
                    <UserButton />
                    <SignOutButton />
                </div>
            </SignedIn>
        </ClerkProvider>
    );
}
