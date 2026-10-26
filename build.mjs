import { cp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const root = import.meta.dirname;
const output = join(root, 'dist');

await rm(output, { recursive: true, force: true });
await mkdir(output);
for (const file of ['index.html', 'styles.css', 'navigation.js', 'clients.js', 'assets']) {
  await cp(join(root, file), join(output, file), { recursive: true });
}
console.log('Static site built in dist/');
