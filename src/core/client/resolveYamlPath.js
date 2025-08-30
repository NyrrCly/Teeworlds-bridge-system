import { fileURLToPath } from 'url';
import path from 'path';

export function resolveRelativePath(importMetaUrl, relativePath) {
    const __filename = fileURLToPath(importMetaUrl);
    const __dirname = path.dirname(__filename);
    return path.resolve(__dirname, relativePath);
}