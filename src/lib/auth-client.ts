import { createAuthClient } from "better-auth/react";

const resolvedBaseURL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

export const authClient = createAuthClient({
  baseURL: resolvedBaseURL,
});

export const { signIn, signOut, signUp, useSession } = authClient;
