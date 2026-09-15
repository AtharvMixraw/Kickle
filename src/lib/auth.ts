import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma"; // ← Import from singleton

const trustedOrigins = [
  "https://playkickle.online",
  "https://www.playkickle.online",
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? []),
].map((origin) => origin.trim()).filter(Boolean);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  
  emailAndPassword: {
    enabled: true,
  },
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins,
});
