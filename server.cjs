const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.send('Server is working');
});

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
});

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

app.get('/api', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/registrations', (req, res) => {
  db.all('SELECT * FROM registrations ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
