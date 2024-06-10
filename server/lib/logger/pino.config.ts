import pino, { LoggerOptions } from "pino";
import { name, version } from "../../package.json";

const isNolog = process.env.NOLOG === "true";

const pinoConfig: LoggerOptions = {
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
  ...((process.env.NODE_ENV === "local" || process.env.NODE_ENV === "test") && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  }),
  level: process.env.LOG_LEVEL || "debug",
  enabled: !isNolog,
};

const baseLogger = pino(pinoConfig);

export const logger = {
  info: (msg: string, context?: Record<string, any>) => {
    if (typeof msg !== "undefined" && !isNolog) {
      baseLogger.info(context, msg);
    }
  },
  error: (msg: string, context?: Record<string, any>) => {
    if (typeof msg !== "undefined") {
      baseLogger.error(context, msg);
    }
  },
  warn: baseLogger.warn.bind(baseLogger),
  debug: baseLogger.debug.bind(baseLogger),
};
