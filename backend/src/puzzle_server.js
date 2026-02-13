const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./puzzle_db');
const { generateSudoku } = require('./sudokuGenerator');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Logic Puzzle Generator API' });
});

app.post('/api/puzzles/generate', (req, res) => {
  const { type = 'sudoku', difficulty = 'medium' } = req.body || {};

  if (type !== 'sudoku') {
    return res.status(400).json({ error: 'Only sudoku puzzles are supported for now.' });
  }

  try {
    const { puzzle, solution } = generateSudoku(difficulty);
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    db.run(
      'INSERT INTO puzzles (id, type, difficulty, puzzle, solution, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, type, difficulty, JSON.stringify(puzzle), JSON.stringify(solution), createdAt],
      function (err) {
        if (err) {
          console.error('Error saving puzzle to DB:', err);
          return res.status(500).json({ error: 'Failed to save puzzle.' });
        }

        res.json({
          id,
          type,
          difficulty,
          puzzle,
          solution,
          createdAt,
        });
      }
    );
  } catch (error) {
    console.error('Error generating puzzle:', error);
    res.status(500).json({ error: 'Failed to generate puzzle.' });
  }
});

app.get('/api/puzzles/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM puzzles WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching puzzle:', err);
      return res.status(500).json({ error: 'Failed to fetch puzzle.' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Puzzle not found.' });
    }

    res.json({
      id: row.id,
      type: row.type,
      difficulty: row.difficulty,
      puzzle: JSON.parse(row.puzzle),
      solution: JSON.parse(row.solution),
      createdAt: row.created_at,
    });
  });
});

app.get('/api/puzzles', (req, res) => {
  db.all(
    'SELECT id, type, difficulty, created_at as createdAt FROM puzzles ORDER BY created_at DESC LIMIT 50',
    [],
    (err, rows) => {
      if (err) {
        console.error('Error listing puzzles:', err);
        return res.status(500).json({ error: 'Failed to list puzzles.' });
      }

      res.json(rows);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Logic Puzzle Generator API listening on port ${PORT}`);
});

