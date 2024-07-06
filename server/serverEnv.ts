import { z } from "zod";

const ServerEnvSchema = z.object({
    CLERK_PUBLISHABLE_KEY: z.string(),
    CLERK_SECRET_KEY: z.string(),
    CORS_ORIGIN: z.string().url(),
    NODE_ENV: z.string(),
});

const env = ServerEnvSchema.parse(process.env);

export const ServerEnv = {
    ...env,
    IS_PRODUCTION: env.NODE_ENV === "production",
};
