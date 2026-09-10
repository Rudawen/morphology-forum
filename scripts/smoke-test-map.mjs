import { spawn } from 'node:child_process';
import path from 'node:path';

const databasePath = process.argv[2];

if (!databasePath) {
  throw new Error('Pass a test database path');
}

const root = path.resolve(import.meta.dirname, '..');
const port = '5067';
const server = spawn(process.execPath, ['server.cjs'], {
  cwd: root,
  env: {
    ...process.env,
    DATABASE_PATH: databasePath,
    PORT: port,
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});

const started = new Promise((resolve, reject) => {
  const timeout = setTimeout(() => reject(new Error('Server start timed out')), 10_000);

  server.stdout.on('data', (chunk) => {
    if (chunk.toString().includes('Server started')) {
      clearTimeout(timeout);
      resolve();
    }
  });

  server.stderr.on('data', (chunk) => {
    clearTimeout(timeout);
    reject(new Error(chunk.toString()));
  });

  server.on('exit', (code) => {
    if (code && code !== 0) reject(new Error(`Server exited with ${code}`));
  });
});

try {
  await started;
  const response = await fetch(`http://127.0.0.1:${port}/participant-cities`);
  const data = await response.json();

  if (!response.ok || !Array.isArray(data.cities)) {
    throw new Error('Participant geography endpoint returned an invalid response');
  }

  console.log(
    JSON.stringify({
      totalParticipants: data.totalParticipants,
      mappedParticipants: data.mappedParticipants,
      cityCount: data.cityCount,
      countryCount: data.countryCount,
      unmatchedParticipants: data.unmatchedParticipants,
      topCities: data.cities.slice(0, 8).map((city) => [city.name, city.count]),
    })
  );
} finally {
  server.kill('SIGTERM');
}
