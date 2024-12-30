import { type Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
} from "@kinde-oss/kinde-typescript-sdk";
import { envKinde } from "./env";

export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain: process.env.KINDE_ISSUER_URL!,
    //  envKinde.authDomain,
    clientId: process.env.KINDE_CLIENT_ID!,
    //  envKinde.clientId,
    clientSecret: process.env.KINDE_CLIENT_SECRET!,
    //  envKinde.clientSecret,
    redirectURL: process.env.KINDE_SITE_URL!,
    //  envKinde.redirectURL,
    logoutRedirectURL: process.env.KINDE_POST_LOGOUT_REDIRECT_URL,
    //  envKinde.logoutRedirectURL,
  }
);

let store: Record<string, unknown> = {};

export const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key);
    return result;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    } as const;
    if (typeof value === "string") {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
      deleteCookie(c, key);
    });
  },
});
