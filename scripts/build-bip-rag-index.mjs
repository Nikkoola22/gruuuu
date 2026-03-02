import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT_DIR = path.resolve('public', 'bip', 'output');
const OUTPUT_FILE = path.join(ROOT_DIR, 'bip-rag-index.json');
const OUTPUT_JSONL_FILE = path.join(ROOT_DIR, 'bip-rag-index.jsonl');
const OUTPUT_FILE_NAME = 'bip-rag-index.json';

async function walkJsonFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkJsonFiles(fullPath)));
      continue;
    }

    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.json')) {
      continue;
    }

    if (entry.name === OUTPUT_FILE_NAME) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function toWebPath(filePath) {
  const relative = path.relative(path.resolve('public'), filePath);
  return `/${relative.split(path.sep).join('/')}`;
}

async function main() {
  const jsonFiles = await walkJsonFiles(ROOT_DIR);
  const aggregated = [];
  let globalId = 1;

  for (const filePath of jsonFiles) {
    const raw = await fs.readFile(filePath, 'utf8');
    let chunks;

    try {
      chunks = JSON.parse(raw);
    } catch {
      continue;
    }

    if (!Array.isArray(chunks)) {
      continue;
    }

    const sourcePath = toWebPath(filePath);
    const sourceName = path.basename(filePath, '.json');

    for (const chunk of chunks) {
      if (!chunk || typeof chunk.content !== 'string') {
        continue;
      }

      const content = chunk.content.trim();
      if (!content) {
        continue;
      }

      aggregated.push({
        id: globalId,
        sourceFile: sourcePath,
        sourceName,
        chunkId: typeof chunk.id === 'number' ? chunk.id : null,
        content,
        length: content.length,
      });
      globalId += 1;
    }
  }

  await fs.writeFile(OUTPUT_FILE, `${JSON.stringify(aggregated, null, 2)}\n`, 'utf8');
  const jsonl = aggregated.map((entry) => JSON.stringify(entry)).join('\n');
  await fs.writeFile(OUTPUT_JSONL_FILE, `${jsonl}\n`, 'utf8');
  console.log(`Indexed ${aggregated.length} chunks from ${jsonFiles.length} files into ${OUTPUT_FILE} and ${OUTPUT_JSONL_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
