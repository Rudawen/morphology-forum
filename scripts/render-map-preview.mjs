import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dataPath = process.argv[2];
const outputPath = process.argv[3];

if (!dataPath || !outputPath) {
  throw new Error('Pass participant-cities JSON and an output HTML path');
}

const root = path.resolve(import.meta.dirname, '..');
const region = JSON.parse(await readFile(path.join(root, 'src/data/region-countries.json'), 'utf8'));
const data = JSON.parse(await readFile(dataPath, 'utf8'));

const width = 1120;
const height = 500;
const minLongitude = 18;
const maxLongitude = 191;
const minLatitude = 34;
const maxLatitude = 82;

function project(longitude, latitude) {
  const wrappedLongitude = longitude < 0 ? longitude + 360 : longitude;
  return [
    24 + ((wrappedLongitude - minLongitude) / (maxLongitude - minLongitude)) * (width - 48),
    24 + ((maxLatitude - latitude) / (maxLatitude - minLatitude)) * (height - 48),
  ];
}

function ringPath(ring) {
  return ring
    .map(([longitude, latitude], index) => {
      const [x, y] = project(longitude, latitude);
      return `${index ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

function geometryPath(geometry) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  return polygons.map((polygon) => polygon.map((ring) => `${ringPath(ring)} Z`).join(' ')).join(' ');
}

const mapPaths = region.features
  .map(
    (feature) =>
      `<path d="${geometryPath(feature.geometry)}" fill="#153E52" stroke="#6E8A96" stroke-width="1.1"/>`
  )
  .join('');

const markers = [...data.cities]
  .sort((left, right) => left.count - right.count)
  .map((city) => {
    const [x, y] = project(city.longitude, city.latitude);
    const radius = Math.min(17, 5.5 + Math.sqrt(city.count) * 1.45);
    return `<g><circle cx="${x}" cy="${y}" r="${radius + 5}" fill="#B8A16A" opacity=".18"/><circle cx="${x}" cy="${y}" r="${radius}" fill="#B8A16A" stroke="#F4E8BD" stroke-width="1.4"/><text x="${x}" y="${y + 4}" text-anchor="middle" fill="#0A2A3A" font-size="${Math.max(10, Math.min(14, radius))}" font-weight="700">${city.count}</text></g>`;
  })
  .join('');

const cityList = data.cities
  .slice(0, 15)
  .map(
    (city) =>
      `<div class="city"><span><strong>${city.name}</strong><small>${city.country}</small></span><b>${city.count}</b></div>`
  )
  .join('');

const html = `<!doctype html>
<html lang="ru">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box}body{margin:0;background:#0A2A3A;color:#fff;font-family:Arial,sans-serif}.section{max-width:1200px;margin:auto;padding:56px 28px 64px}.eyebrow{text-align:center;color:#DCC98D;letter-spacing:.2em;text-transform:uppercase;font-size:13px}.title{text-align:center;font-size:40px;margin:14px 0 12px}.intro{max-width:760px;margin:0 auto 32px;text-align:center;color:#ffffffb8;line-height:1.55}.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}.stat{display:flex;justify-content:center;gap:9px;padding:16px;border:1px solid #ffffff1c;border-radius:12px;background:#ffffff10}.stat b{color:#DCC98D;font-size:22px}.stat span{color:#ffffffb8;padding-top:4px}.map{overflow:auto;border:1px solid #ffffff20;background:#0D3142;border-radius:18px;padding:18px;box-shadow:0 20px 45px #0003}.map svg{display:block;min-width:760px;width:100%;height:auto}.cities{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:20px}.city{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;background:#ffffff0e;border:1px solid #ffffff18;border-radius:10px}.city strong,.city small{display:block}.city strong{font-size:14px}.city small{font-size:11px;color:#ffffff88;margin-top:3px}.city b{background:#B8A16A;color:#0A2A3A;border-radius:999px;padding:5px 9px}@media(max-width:680px){.section{padding:36px 14px}.title{font-size:30px}.stats{grid-template-columns:1fr}.cities{grid-template-columns:1fr 1fr}.map{padding:9px}}
</style>
<body><section class="section"><div class="eyebrow">География форума</div><h1 class="title">Города наших участников</h1><p class="intro">Петербургский Морфологический Форум объединяет специалистов из разных регионов России и ближнего зарубежья.</p><div class="stats"><div class="stat"><b>${data.totalParticipants}</b><span>участников</span></div><div class="stat"><b>${data.cityCount}</b><span>города</span></div><div class="stat"><b>${data.countryCount}</b><span>стран</span></div></div><div class="map"><svg viewBox="0 0 ${width} ${height}" aria-label="Карта городов участников">${mapPaths}${markers}</svg></div><div class="cities">${cityList}</div></section></body></html>`;

await writeFile(outputPath, html);
console.log(outputPath);
