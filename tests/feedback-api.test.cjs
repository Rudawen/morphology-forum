const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');

const port = 5600 + (process.pid % 300);
const baseUrl = `http://127.0.0.1:${port}`;
const databasePath = path.join(os.tmpdir(), `pmf-feedback-test-${process.pid}-${Date.now()}.db`);
let server;

before(async () => {
  server = spawn(process.execPath, ['server.cjs'], {
    cwd: path.resolve(__dirname, '..'),
    env: {
      ...process.env,
      PORT: String(port),
      DATABASE_PATH: databasePath,
      ADMIN_PASSWORD: 'test-admin-password',
      NODE_ENV: 'test',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Server start timeout')), 10000);
    server.once('error', reject);
    server.stdout.on('data', (chunk) => {
      if (chunk.toString().includes('Server started')) {
        clearTimeout(timeout);
        resolve();
      }
    });
    server.stderr.on('data', (chunk) => {
      const message = chunk.toString();
      if (message.trim()) reject(new Error(message));
    });
  });
});

after(() => {
  server?.kill('SIGTERM');
});

test('feedback flow supports anonymous and optional-contact responses', async () => {
  const health = await fetch(`${baseUrl}/api`);
  assert.equal(health.status, 200);

  const invalid = await fetch(`${baseUrl}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating: 0 }),
  });
  assert.equal(invalid.status, 400);

  const anonymous = await fetch(`${baseUrl}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rating: 5,
      liked: 'Доклады и общение',
      next_topics: 'Больше разборов клинических случаев',
      participation: ['Предложить доклад'],
      consent: false,
    }),
  });
  assert.equal(anonymous.status, 200);

  const missingConsent = await fetch(`${baseUrl}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating: 4, respondent_name: 'Тест', contact: '@test' }),
  });
  assert.equal(missingConsent.status, 400);

  const withContact = await fetch(`${baseUrl}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rating: 4,
      respondent_name: 'Тест',
      contact: '@test',
      organization: 'Лаборатория',
      participation: ['Провести мастер-класс'],
      consent: true,
    }),
  });
  assert.equal(withContact.status, 200);

  const unauthorized = await fetch(`${baseUrl}/feedback-responses`);
  assert.equal(unauthorized.status, 401);

  const login = await fetch(`${baseUrl}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'test-admin-password' }),
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.get('set-cookie').split(';')[0];

  const list = await fetch(`${baseUrl}/feedback-responses`, { headers: { Cookie: cookie } });
  assert.equal(list.status, 200);
  const responses = await list.json();
  assert.equal(responses.length, 2);
  assert.equal(responses[0].contact, '@test');
  assert.equal(responses[1].respondent_name, '');

  const deleted = await fetch(`${baseUrl}/feedback-responses/${responses[0].id}`, {
    method: 'DELETE',
    headers: { Cookie: cookie },
  });
  assert.equal(deleted.status, 200);
  assert.equal((await deleted.json()).deleted, 1);
});
