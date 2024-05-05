import { name, version } from "../../package.json";
import pino from "pino";

const pinoConfig = {
  redact: ["req.headers.authorization", "req.headers.cookie"],
  formatters: {
    level(label) {
      return {
        level: label,
        service: name,
        env: process.env.NODE_ENV,
        version,
      };
    },
  },
  ...(process.env.NODE_ENV === "local" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  }),
  level: process.env.LOG_LEVEL || "debug",
};

export const logger = pino(pinoConfig);
