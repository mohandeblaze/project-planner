import { z } from "zod";

const AppEnvSchema = z.object({
    CLERK_PUBLISHABLE_KEY: z.string(),
    CLERK_SECRET_KEY: z.string(),
    CORS_ORIGIN: z.string().url(),
});

export const AppEnv = AppEnvSchema.parse(process.env);
