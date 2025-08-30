import 'dotenv/config'
import {econConnection} from './src/core/econConnection.js';
import {resolveRelativePath} from './src/core/client/resolveYamlPath.js';
import yaml from 'js-yaml';
import fs from 'fs';

const fileRaw = fs.readFileSync(resolveRelativePath(import.meta.url, './configs/econ-servers.yaml'), 'utf8');
const config = yaml.load(fileRaw);

for (const [name, cfg] of Object.entries(config.servers)) {
    await econConnection({
        name,
        host: cfg.host,
        port: cfg.port,
        password: cfg.password,
        webhookUrl: cfg.webhook,
        econRegex: cfg.econRegex,
        cfg: cfg
    });
}