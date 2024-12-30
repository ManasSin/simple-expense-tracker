import { z } from "zod";
import process from "node:process";

export const kindeEnv = z.object({
  authDomain: z.string().url(),
  clientId: z.string(),
  clientSecret: z.string(),
  redirectURL: z.string().url(),
  logoutRedirectURL: z.string().url(),
});

export const envKinde = kindeEnv.parse(process.env);
