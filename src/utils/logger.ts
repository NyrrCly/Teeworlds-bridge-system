import pino from "pino";

export const logger = pino({
  level: "debug",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:yyyy-mm-dd | HH:MM:ss",
      ignore: "pid,hostname",
    },
  },
});
