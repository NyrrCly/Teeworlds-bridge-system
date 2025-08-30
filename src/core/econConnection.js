import {WebhookClient} from 'discord.js';
import filterMessage from "./utils/filterMessage.js";
import net from 'net';
import logger from './client/logger.js';

export async function econConnection({name, host, port, password, webhookUrl, econRegex, cfg}) {
    const socket = new net.Socket();
    const webhook = new WebhookClient({url: webhookUrl});
    let heartbeat = await startHeartbeat(socket);

    socket.connect(port, host, () => {
        logger.info(`[${name}] ECON connected`);
        socket.write(`${password}\n`);

        heartbeat = setInterval(() => {
            if (!socket.destroyed) socket.write('\n');
        }, 20000);
    });

    socket.on('data', async (data) => {
        const msg = data.toString().trim();
        const regex = new RegExp(econRegex);
        const match = msg.match(regex);
        if (!match) return;

        const playerRaw = match[2];
        const message = match[3];
        const filtered = await filterMessage(message);
        if (!filtered) return;

        await webhook.send({
            username: playerRaw,
            avatarURL: 'https://png-pixel.com/1x1-ffffff7f.png',
            content: message,
        });
    });

    socket.on('close', () => clearInterval(heartbeat));
    socket.on('close', hadError => {
        clearInterval(heartbeat);
        logger.warn(`[${name}] ECON socket closed. Had error: ${hadError}`);
        logger.warn(`[${name}] Reconnecting in 60s...`);
        setTimeout(() => econConnection({name, host, port, password, webhookUrl, chatRegex, cfg}), 60000);
    });
    socket.on('error', (err) => {
        logger.error(`[${name}] ECON error: ${err.message}`);
    });
}

async function startHeartbeat(socket) {
    return setInterval(() => {
        if (!socket.destroyed) socket.write('\n');
    }, 20000);
}