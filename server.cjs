const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
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
const DATABASE_PATH = process.env.DATABASE_PATH || './database.db';

const cityIndex = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'server-data', 'city-index.json'), 'utf8')
);

const countryNames = {
  AM: 'Армения',
  AZ: 'Азербайджан',
  BY: 'Беларусь',
  EE: 'Эстония',
  GE: 'Грузия',
  KZ: 'Казахстан',
  KG: 'Кыргызстан',
  LV: 'Латвия',
  LT: 'Литва',
  MD: 'Молдова',
  RU: 'Россия',
  TJ: 'Таджикистан',
  TM: 'Туркменистан',
  UA: 'Украина',
  UZ: 'Узбекистан',
};

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const db = new sqlite3.Database(DATABASE_PATH);

function normalizeCity(value) {
  return value
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase('ru-RU')
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function cityLookupCandidates(value) {
  const normalized = normalizeCity(value);
  const candidates = new Set([normalized]);

  candidates.add(normalized.replace(/^(г|город|city)\s+/, '').trim());

  const firstPart = normalizeCity(value.split(',')[0]);
  candidates.add(firstPart.replace(/^(г|город|city)\s+/, '').trim());

  if (
    normalized.includes('санкт петербург') ||
    ['спб', 'spb', 'питер', 'saint petersburg', 'st petersburg'].includes(normalized)
  ) {
    candidates.add('санкт петербург');
  }

  if (normalized === 'н новгород') {
    candidates.add('нижнии новгород');
  }

  for (const candidate of [...candidates]) {
    candidates.add(
      candidate
        .replace(/\s+(ленинградская|ленинградскои|московская|московскои)\s+област[ьи].*$/, '')
        .trim()
    );
  }

  return [...candidates].filter(Boolean);
}

function resolveCity(value) {
  for (const candidate of cityLookupCandidates(value)) {
    const placeIndex = cityIndex.aliases[candidate];

    if (placeIndex !== undefined) {
      const [id, name, latitude, longitude, countryCode] = cityIndex.places[placeIndex];
      return { id, name, latitude, longitude, countryCode };
    }
  }

  return null;
}

function cleanCityLabel(value, fallbackName) {
  const normalized = normalizeCity(value);

  if (
    normalized.includes('санкт петербург') ||
    ['спб', 'spb', 'питер', 'saint petersburg', 'st petersburg'].includes(normalized)
  ) {
    return 'Санкт-Петербург';
  }

  if (normalized === 'н новгород') {
    return 'Нижний Новгород';
  }

  let label = value
    .trim()
    .replace(/^(г\.?|город|city)\s+/i, '')
    .split(',')[0]
    .replace(/\s+(Ленинградской|Московской)\s+области.*$/i, '')
    .trim();

  if (!label || /область$/i.test(label)) {
    label = fallbackName;
  }

  if (label === label.toLocaleUpperCase('ru-RU')) {
    label = label.charAt(0).toLocaleUpperCase('ru-RU') + label.slice(1).toLocaleLowerCase('ru-RU');
  }

  return label;
}

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

app.get('/participant-cities', (req, res) => {
  db.all(
    `SELECT city
     FROM registrations
     WHERE city IS NOT NULL AND TRIM(city) <> ''`,
    [],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      const groupedCities = new Map();
      let unmatchedParticipants = 0;

      for (const row of rows) {
        const resolved = resolveCity(row.city);

        if (!resolved) {
          unmatchedParticipants += 1;
          continue;
        }

        const existing = groupedCities.get(resolved.id) || {
          ...resolved,
          count: 0,
          labels: new Map(),
        };
        const cleanedLabel = cleanCityLabel(row.city, resolved.name);

        existing.count += 1;
        existing.labels.set(cleanedLabel, (existing.labels.get(cleanedLabel) || 0) + 1);
        groupedCities.set(resolved.id, existing);
      }

      const cities = [...groupedCities.values()]
        .map((city) => {
          const displayName = [...city.labels.entries()].sort(
            (left, right) => right[1] - left[1] || left[0].localeCompare(right[0], 'ru')
          )[0][0];

          return {
            name: displayName,
            count: city.count,
            latitude: city.latitude,
            longitude: city.longitude,
            countryCode: city.countryCode,
            country: countryNames[city.countryCode] || city.countryCode,
          };
        })
        .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, 'ru'));

      const countryCount = new Set(cities.map((city) => city.countryCode)).size;

      res.json({
        totalParticipants: rows.length,
        mappedParticipants: rows.length - unmatchedParticipants,
        unmatchedParticipants,
        cityCount: cities.length,
        countryCount,
        cities,
      });
    }
  );
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
