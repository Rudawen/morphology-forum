const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2026';
const MASTERCLASS_ADMIN_PASSWORD = process.env.MASTERCLASS_ADMIN_PASSWORD || '123098QA';
const ADMIN_TOKEN = crypto.randomBytes(32).toString('hex');
const MASTERCLASS_ADMIN_TOKEN = crypto.randomBytes(32).toString('hex');
const COOKIE_NAME = 'pmf_admin';
const MASTERCLASS_COOKIE_NAME = 'pmf_masterclass_admin';

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT,
      last_name TEXT,
      email TEXT,
      phone TEXT,
      organization TEXT,
      position TEXT,
      city TEXT,
      specialty TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.all('PRAGMA table_info(registrations)', [], (err, columns) => {
    if (err) {
      console.error(err);
      return;
    }

    const existing = new Set(columns.map((column) => column.name));
    const required = {
      first_name: 'TEXT',
      last_name: 'TEXT',
      email: 'TEXT',
      phone: 'TEXT',
      organization: 'TEXT',
      position: 'TEXT',
      city: 'TEXT',
      specialty: 'TEXT',
      created_at: 'TEXT DEFAULT CURRENT_TIMESTAMP',
    };

    for (const [name, type] of Object.entries(required)) {
      if (!existing.has(name)) {
        db.run(`ALTER TABLE registrations ADD COLUMN ${name} ${type}`);
      }
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS masterclass_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT,
      email TEXT,
      phone TEXT,
      workplace TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.all('PRAGMA table_info(masterclass_registrations)', [], (err, columns) => {
    if (err) {
      console.error(err);
      return;
    }

    const existing = new Set(columns.map((column) => column.name));
    const required = {
      full_name: 'TEXT',
      email: 'TEXT',
      phone: 'TEXT',
      workplace: 'TEXT',
      created_at: 'TEXT DEFAULT CURRENT_TIMESTAMP',
    };

    for (const [name, type] of Object.entries(required)) {
      if (!existing.has(name)) {
        db.run(`ALTER TABLE masterclass_registrations ADD COLUMN ${name} ${type}`);
      }
    }
  });
});

function parseCookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || '')
      .split(';')
      .filter(Boolean)
      .map((cookie) => {
        const [name, ...rest] = cookie.trim().split('=');
        return [name, decodeURIComponent(rest.join('='))];
      })
  );
}

function requireAdmin(req, res, next) {
  const cookies = parseCookies(req);

  if (cookies[COOKIE_NAME] !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

function requireMasterclassAdmin(req, res, next) {
  const cookies = parseCookies(req);

  if (cookies[MASTERCLASS_COOKIE_NAME] !== MASTERCLASS_ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

app.post('/register', (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    organization,
    position,
    city,
    specialty,
  } = req.body;

  const values = [
    first_name,
    last_name,
    email,
    phone,
    organization,
    position,
    city,
    specialty,
  ];

  if (values.some((value) => typeof value !== 'string' || !value.trim())) {
    return res.status(400).json({ error: 'Заполните все поля' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Введите корректный Email' });
  }

  db.run(
    `INSERT INTO registrations
      (first_name, last_name, email, phone, organization, position, city, specialty)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    values.map((value) => value.trim()),
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      res.json({ success: true });
    }
  );
});

app.post('/masterclass-register', (req, res) => {
  const { full_name, email, phone, workplace = '' } = req.body;

  const requiredValues = [full_name, email, phone];

  if (requiredValues.some((value) => typeof value !== 'string' || !value.trim())) {
    return res.status(400).json({ error: 'Заполните обязательные поля' });
  }

  if (typeof workplace !== 'string') {
    return res.status(400).json({ error: 'Проверьте место работы / должность' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Введите корректный Email' });
  }

  db.run(
    `INSERT INTO masterclass_registrations
      (full_name, email, phone, workplace)
     VALUES (?, ?, ?, ?)`,
    [full_name, email, phone, workplace].map((value) => value.trim()),
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      res.json({ success: true });
    }
  );
});

app.get('/api', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/admin/login', (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Неверный пароль' });
  }

  res.cookie(COOKIE_NAME, ADMIN_TOKEN, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 8,
  });

  res.json({ success: true });
});

app.post('/admin/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true });
});

app.get('/admin/me', requireAdmin, (req, res) => {
  res.json({ authenticated: true });
});

app.get('/registrations', requireAdmin, (req, res) => {
  db.all('SELECT * FROM registrations ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    res.json(rows);
  });
});

app.post('/admin-masterclass/login', (req, res) => {
  if (req.body.password !== MASTERCLASS_ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Неверный пароль' });
  }

  res.cookie(MASTERCLASS_COOKIE_NAME, MASTERCLASS_ADMIN_TOKEN, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 8,
  });

  res.json({ success: true });
});

app.post('/admin-masterclass/logout', (req, res) => {
  res.clearCookie(MASTERCLASS_COOKIE_NAME);
  res.json({ success: true });
});

app.get('/admin-masterclass/me', requireMasterclassAdmin, (req, res) => {
  res.json({ authenticated: true });
});

app.get('/masterclass-registrations', requireMasterclassAdmin, (req, res) => {
  db.all('SELECT * FROM masterclass_registrations ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    res.json(rows);
  });
});

app.delete('/masterclass-registrations/:id', requireMasterclassAdmin, (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Некорректный ID' });
  }

  db.run('DELETE FROM masterclass_registrations WHERE id = ?', [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    res.json({ success: true, deleted: this.changes });
  });
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
