const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, '..', 'puzzles.db');

const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS puzzles (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      puzzle TEXT NOT NULL,
      solution TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`
  );
});

module.exports = db;

