import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const sourcePath = process.argv[2];

if (!sourcePath) {
  throw new Error('Pass the GeoNames cities text file path');
}

const countryCodes = new Set([
  'AM',
  'AZ',
  'BY',
  'EE',
  'GE',
  'KZ',
  'KG',
  'LV',
  'LT',
  'MD',
  'RU',
  'TJ',
  'TM',
  'UA',
  'UZ',
]);

function normalize(value) {
  return value
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase('ru-RU')
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

const rows = (await readFile(sourcePath, 'utf8')).split('\n');
const places = [];
const aliasCandidates = new Map();

for (const row of rows) {
  if (!row) continue;

  const fields = row.split('\t');
  const countryCode = fields[8];
  const featureClass = fields[6];
  const featureCode = fields[7];

  if (
    !countryCodes.has(countryCode) ||
    featureClass !== 'P' ||
    !featureCode.startsWith('PPL')
  ) {
    continue;
  }

  const geonameId = Number(fields[0]);
  const name = fields[1];
  const asciiName = fields[2];
  const alternateNames = fields[3] ? fields[3].split(',') : [];
  const latitude = Number(fields[4]);
  const longitude = Number(fields[5]);
  const population = Number(fields[14]) || 0;
  const placeIndex = places.length;

  places.push([geonameId, name, latitude, longitude, countryCode, population]);

  const aliases = new Set([name, asciiName, ...alternateNames]);

  for (const alias of aliases) {
    if (!alias || alias.length > 80) continue;
    if (!/^[\p{Script=Cyrillic}\p{Script=Latin}\d .’'()\-]+$/u.test(alias)) continue;

    const normalized = normalize(alias);
    if (!normalized || normalized.length < 2) continue;

    const previous = aliasCandidates.get(normalized);
    if (!previous || population > previous.population) {
      aliasCandidates.set(normalized, { placeIndex, population });
    }
  }
}

const aliases = Object.fromEntries(
  [...aliasCandidates.entries()]
    .sort(([left], [right]) => left.localeCompare(right, 'ru'))
    .map(([alias, value]) => [alias, value.placeIndex])
);

const targetPath = path.resolve('server-data/city-index.json');
await mkdir(path.dirname(targetPath), { recursive: true });
await writeFile(targetPath, JSON.stringify({ places, aliases }));

console.log(`Wrote ${places.length} places and ${Object.keys(aliases).length} aliases to ${targetPath}`);
