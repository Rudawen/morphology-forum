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
app.use(express.json({ limit: '32kb' }));
app.use(express.static('dist'));

const db = new sqlite3.Database(process.env.DATABASE_PATH || './database.db');

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

  db.run(`
    CREATE TABLE IF NOT EXISTS feedback_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rating INTEGER NOT NULL,
      liked TEXT,
      improvements TEXT,
      next_topics TEXT,
      participation TEXT,
      respondent_name TEXT,
      contact TEXT,
      organization TEXT,
      consent INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

const feedbackParticipationOptions = new Set([
  'Предложить доклад',
  'Провести мастер-класс',
  'Стать партнёром форума',
  'Помочь в организации',
  'Получать новости форума',
]);

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

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
  res.status(410).json({
    closed: true,
    error: 'Регистрация на конференцию закрыта',
  });
});

app.post('/masterclass-register', (req, res) => {
  res.status(410).json({
    closed: true,
    error: 'Регистрация на мастер-класс закрыта',
  });
});

app.post('/feedback', (req, res) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};

  if (cleanText(body.website, 200)) {
    return res.json({ success: true });
  }

  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Поставьте оценку от 1 до 5' });
  }

  const participation = Array.isArray(body.participation)
    ? body.participation.filter((item) => feedbackParticipationOptions.has(item)).slice(0, 5)
    : [];
  const liked = cleanText(body.liked, 2000);
  const improvements = cleanText(body.improvements, 2000);
  const nextTopics = cleanText(body.next_topics, 2000);
  const respondentName = cleanText(body.respondent_name, 160);
  const contact = cleanText(body.contact, 240);
  const organization = cleanText(body.organization, 240);
  const hasContacts = Boolean(respondentName || contact || organization);

  if (hasContacts && body.consent !== true) {
    return res.status(400).json({ error: 'Подтвердите согласие на обработку контактных данных' });
  }

  db.run(
    `INSERT INTO feedback_responses
      (rating, liked, improvements, next_topics, participation, respondent_name, contact, organization, consent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      rating,
      liked,
      improvements,
      nextTopics,
      participation.join(' | '),
      respondentName,
      contact,
      organization,
      hasContacts ? 1 : 0,
    ],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Не удалось сохранить ответ' });
      }

      res.json({ success: true, id: this.lastID });
    },
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

app.get('/feedback-responses', requireAdmin, (req, res) => {
  db.all(
    `SELECT id, rating, liked, improvements, next_topics, participation,
            respondent_name, contact, organization, created_at
     FROM feedback_responses
     ORDER BY id DESC`,
    [],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      res.json(rows);
    },
  );
});

app.delete('/feedback-responses/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Некорректный ID' });
  }

  db.run('DELETE FROM feedback_responses WHERE id = ?', [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    res.json({ success: true, deleted: this.changes });
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
