import { readFile, writeFile } from 'node:fs/promises';
import Typograf from 'typograf';

// Format the source once; no typography library or text replacement in the browser.
const typograf = new Typograf({
  locale: ['ru', 'en-US'],
  enableRule: ['common/nbsp/afterNumber'],
});
for (const name of ['index.html', 'genglass.html']) {
  const file = new URL(name, import.meta.url);
  const source = await readFile(file, 'utf8');
  // Keep the last two words of paragraphs and headings together across browsers.
  const formatted = typograf.execute(source).replace(/\be-commerce\b/g, 'e\u2011commerce').replace(
    /(<(?:p|h3)\b[^>]*>)([\s\S]*?)(<\/(?:p|h3)>)/g,
    (_, open, text, close) => open + text.replace(
      /([\p{L}\p{N}][\p{L}\p{N}+/–.-]*)[ \u00a0]+([\p{L}\p{N}][\p{L}\p{N}+/–.-]*[.!?…]?)((?:<\/span>)?)$/u,
      '$1\u00a0$2$3',
    ) + close,
  );
  if (formatted !== source) await writeFile(file, formatted);
}
