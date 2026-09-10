import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const sourcePath = process.argv[2];

if (!sourcePath) {
  throw new Error('Pass the Natural Earth GeoJSON source path');
}

const regionCodes = new Set([
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

const source = JSON.parse(await readFile(sourcePath, 'utf8'));
const region = {
  type: 'FeatureCollection',
  features: source.features
    .filter((feature) => regionCodes.has(feature.properties.ISO_A2_EH))
    .map((feature) => ({
      type: 'Feature',
      properties: {
        code: feature.properties.ISO_A2_EH,
        name: feature.properties.NAME_RU,
      },
      geometry: feature.geometry,
    })),
};

const targetPath = path.resolve('src/data/region-countries.json');
await mkdir(path.dirname(targetPath), { recursive: true });
await writeFile(targetPath, `${JSON.stringify(region)}\n`);

console.log(`Wrote ${region.features.length} country outlines to ${targetPath}`);
