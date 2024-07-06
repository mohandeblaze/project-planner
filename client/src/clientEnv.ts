import { z } from "zod";

const ClientEnvSchema = z.object({
    VITE_API_URL: z.string(),
    VITE_CLERK_PUBLISHABLE_KEY: z.string(),
});

export const ClientEnv = ClientEnvSchema.parse(import.meta.env);
