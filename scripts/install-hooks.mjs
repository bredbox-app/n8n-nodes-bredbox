import { mkdirSync, writeFileSync, chmodSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '..');
const hooksDir = resolve(repoRoot, '.git/hooks');
const preCommitPath = resolve(hooksDir, 'pre-commit');

mkdirSync(hooksDir, { recursive: true });

const script = `#!/usr/bin/env sh
set -e
cd "${repoRoot}"
npm run lint:fix
`;

if (!existsSync(preCommitPath)) {
  writeFileSync(preCommitPath, script, { mode: 0o755 });
} else {
  writeFileSync(preCommitPath, script, { mode: 0o755 });
}

chmodSync(preCommitPath, 0o755);
console.log('Installed Git pre-commit hook.');
