import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dist = resolve(root, 'dist');
const htmlPath = resolve(dist, 'index.html');
const serverEntry = resolve(dist, 'server/entry-server.js');

const [{ render }, html] = await Promise.all([
  import(pathToFileURL(serverEntry).href),
  readFile(htmlPath, 'utf8'),
]);

const rendered = render();
if (typeof rendered !== 'string' || rendered.trim().length < 500) {
  throw new Error('React prerender produced too little HTML; refusing to ship an empty shell.');
}

const rootMount = '<div id="root"></div>';
if (!html.includes(rootMount)) {
  throw new Error('Could not find the #root mount in the built Vite HTML.');
}

await writeFile(htmlPath, html.replace(rootMount, `<div id="root">${rendered}</div>`));
console.log(`Prerendered ${rendered.length.toLocaleString()} characters of page HTML.`);
