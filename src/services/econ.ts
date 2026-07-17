import { ServerConfig } from "../shared/types.js";
import * as net from "node:net";
import { WebhookClient } from "discord.js";
import { logger } from "./logger.js";
import { messageFilter } from "../utils/filters.js";

export async function econConnection(name: string, config: ServerConfig) {
  const socket = new net.Socket();
  const webhook = new WebhookClient({
    url: config.webhook,
  });
  const regex = new RegExp(config.econRegex);

  socket.connect(config.port, config.host, () => {
    logger.info(`[${name}] ECON connected`);
    socket.write(`${config.password}\n`);
  });

  socket.on("data", async (data) => {
    const msg = data.toString().trim();
    const formatedMessage = msg.match(regex);
    if (!formatedMessage) return;

    const playerName = formatedMessage[2];
    const playerMessage = formatedMessage[3];
    const filtered = messageFilter(playerMessage);
    if (!filtered) return;

    await webhook.send({
      username: playerName,
      avatarURL: "https://png-pixel.com/1x1-ffffff7f.png",
      content: playerMessage,
    });
  });

  socket.on("close", async () => {
    logger.warn(`[${name}] ECON disconnected`);
    logger.warn(`[${name}] Reconnecting in 60s...`);
    socket.end();
    setTimeout(() => {
      econConnection(name, config);
    }, 60 * 1000);
  });
  socket.on("error", () => {});
  socket.on("connectionAttemptFailed", () => {
    logger.warn(`[${name}] Connection Attempt Failed`);
  });
}
