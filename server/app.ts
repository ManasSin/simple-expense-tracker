import { Hono } from "hono";
import { logger } from "hono-pino";
import { pino } from "pino";
import pretty from "pino-pretty";
import expenses from "./routes/expenses";
import { serveStatic } from "hono/bun";
import { authRoute } from "./routes/auth";

const app = new Hono();

const pinoLogger = () =>
  logger({
    pino: pino(pretty()),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });

app.use("*", pinoLogger());

const apiRouters = app
  .basePath("/api")
  .route("/expenses", expenses)
  .route("/auth", authRoute);

app
  .get("*", serveStatic({ root: "./frontend/dist" }))
  .get("*", serveStatic({ path: "./frontend/dist/index.html" }))
  .all("*", (c) => c.text("route not found"));

export default app;

export type ApiRoutes = typeof apiRouters;
