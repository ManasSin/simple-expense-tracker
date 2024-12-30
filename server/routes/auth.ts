import { Hono } from "hono";
import { kindeClient, sessionManager } from "../kinde";

export const authRoute = new Hono()
  .get("/login", async (c) => {
    const loginUrl = await kindeClient.login(sessionManager(c));
    return c.redirect(loginUrl.toString());
  })
  .get("/register", async (c) => {
    const registerUrl = await kindeClient.register(sessionManager(c));
    return c.redirect(registerUrl.toString());
  })
  .get("/callback", async (c) => {
    const url = new URL(c.req.url);
    // @ts-ignore
    await kindeClient.handleRedirectToApp(sessionManager(c), url);
    return c.redirect("/");
  })
  .get("/logout", async (c) => {
    const logoutUrl = await kindeClient.logout(sessionManager(c));
    return c.redirect(logoutUrl.toString());
  })
  .get("/user", async (c) => {
    const isAuthenticated = await kindeClient.isAuthenticated(
      sessionManager(c)
    ); // Boolean: true or false
    return c.json({ isAuthenticated });
    if (isAuthenticated) {
      // Need to implement, e.g: call an api, etc...
    } else {
      // Need to implement, e.g: redirect user to sign in, etc..
    }
  });
