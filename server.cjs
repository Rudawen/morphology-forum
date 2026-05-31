const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is working');
});

const db = new sqlite3.Database('./database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    comment TEXT
  )
`);

app.post('/register', (req, res) => {
  const { name, email, phone, comment } = req.body;

  db.run(
    `INSERT INTO registrations (name, email, phone, comment)
     VALUES (?, ?, ?, ?)`,
    [name, email, phone, comment],
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
  db.all('SELECT * FROM registrations', [], (err, rows) => {
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