import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "yaml";
import { EconServers } from "./shared/types.js";
import { econConnection } from "./services/econ.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serversList = parse(
  fs.readFileSync(path.join(__dirname, "../configs/econ-servers.yaml"), "utf8"),
) as EconServers;

for (const [name, config] of Object.entries(serversList.servers)) {
  await econConnection(name, config);
}
