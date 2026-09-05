import fs from 'node:fs';

const [sourcePath, outputPath] = process.argv.slice(2);
if (!sourcePath || !outputPath) throw new Error('Usage: node generate-section-library.mjs SOURCE.md OUTPUT.js');

const lines = fs.readFileSync(sourcePath, 'utf8').split(/\r?\n/);
let divisionTitle = '';
let category = '';
const sections = [];

for (const line of lines) {
  const division = line.match(/^## Division (\d{2})\s+[–-]\s+(.+)$/);
  if (division) {
    divisionTitle = `Division ${division[1]} – ${division[2].trim()}`;
    category = '';
    continue;
  }
  const group = line.match(/^###\s+(.+)$/);
  if (group) {
    category = group[1].trim();
    continue;
  }
  const section = line.match(/^-\s+`([^`]+)`\s+[–-]\s+(.+)$/);
  if (!section) continue;
  const number = section[1].trim();
  sections.push({
    number,
    title: section[2].trim(),
    division: number.slice(0, 2),
    divisionTitle,
    category
  });
}

const banner = '// Generated from Architectural_Specification_Section_Library.md. Do not edit by hand.\n';
fs.writeFileSync(outputPath, `${banner}globalThis.OUTLINE_SPEC_MASTER_SECTIONS = ${JSON.stringify(sections, null, 2)};\n`);
console.log(`Generated ${sections.length} master sections.`);
