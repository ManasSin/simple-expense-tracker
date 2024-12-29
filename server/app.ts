import { Hono } from "hono";
import { logger } from "hono-pino";
import { pino } from "pino";
import pretty from "pino-pretty";
import expenses from "./routes/expenses";

const app = new Hono();

const pinoLogger = () =>
  logger({
    pino: pino(pretty()),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });

app.use(pinoLogger());

app
  .get("/", (c) => c.text("Hello Bun!"))
  .get("/test", (c) => c.json({ message: "this is test route" }))
  .route("/api/expenses", expenses)
  .all("/*", (c) => c.text("route not found"));

export default app;
