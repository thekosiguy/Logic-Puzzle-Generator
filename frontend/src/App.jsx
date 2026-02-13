import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { SudokuBoard } from './components/SudokuBoard.jsx';
import { DifficultySelector } from './components/DifficultySelector.jsx';

const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light dark;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: radial-gradient(circle at top, #1f2933 0, #020617 60%);
    color: #f9fafb;
    min-height: 100vh;
  }
`;

const AppShell = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
`;

const Card = styled.main`
  width: 100%;
  max-width: 960px;
  background: rgba(15, 23, 42, 0.92);
  border-radius: 18px;
  box-shadow:
    0 24px 60px rgba(15, 23, 42, 0.7),
    0 0 0 1px rgba(148, 163, 184, 0.1);
  padding: 1.75rem;
  backdrop-filter: blur(20px);
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(1.5rem, 2.2vw, 2rem);
  letter-spacing: 0.04em;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #9ca3af;
`;

const Badge = styled.span`
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: rgba(34, 197, 94, 0.1);
  color: #bbf7d0;
  border: 1px solid rgba(34, 197, 94, 0.35);
`;

const Content = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2.2fr);
  gap: 1.5rem;

  @media (max-width: 860px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PrimaryButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 0.9rem 1.5rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: pointer;
  background: linear-gradient(135deg, #22c55e, #a3e635);
  color: #052e16;
  box-shadow: 0 18px 40px rgba(34, 197, 94, 0.45);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: transform 0.1s ease, box-shadow 0.1s ease, filter 0.1s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 20px 50px rgba(34, 197, 94, 0.6);
    filter: brightness(1.02);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 10px 25px rgba(34, 197, 94, 0.5);
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
    transform: none;
    box-shadow: none;
  }
`;

const StatusText = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #9ca3af;
`;

const ErrorText = styled(StatusText)`
  color: #fecaca;
`;

const ValidationBlock = styled.div`
  margin-top: 0.5rem;
`;

const HintList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0.75rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: #9ca3af;
`;

const SuccessText = styled(StatusText)`
  color: #bbf7d0;
`;

const InfoText = styled(StatusText)`
  color: #a5b4fc;
`;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function App() {
  const [difficulty, setDifficulty] = useState('medium');
  const [puzzle, setPuzzle] = useState(null);
  const [userGrid, setUserGrid] = useState(null);
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastGeneratedId, setLastGeneratedId] = useState('');
  const [conflicts, setConflicts] = useState(new Set());
  const [validationMessage, setValidationMessage] = useState('');
  const [validationState, setValidationState] = useState('idle'); // idle | info | success | error

  const computeConflicts = (grid) => {
    const conflictsSet = new Set();
    if (!grid) return conflictsSet;

    const addConflict = (r, c) => {
      conflictsSet.add(`${r}-${c}`);
    };

    // Rows
    for (let r = 0; r < 9; r++) {
      const seen = {};
      for (let c = 0; c < 9; c++) {
        const v = grid[r][c];
        if (!v) continue;
        if (!seen[v]) {
          seen[v] = [];
        }
        seen[v].push([r, c]);
      }
      Object.values(seen).forEach((cells) => {
        if (cells.length > 1) {
          cells.forEach(([rr, cc]) => addConflict(rr, cc));
        }
      });
    }

    // Columns
    for (let c = 0; c < 9; c++) {
      const seen = {};
      for (let r = 0; r < 9; r++) {
        const v = grid[r][c];
        if (!v) continue;
        if (!seen[v]) {
          seen[v] = [];
        }
        seen[v].push([r, c]);
      }
      Object.values(seen).forEach((cells) => {
        if (cells.length > 1) {
          cells.forEach(([rr, cc]) => addConflict(rr, cc));
        }
      });
    }

    // 3x3 boxes
    for (let br = 0; br < 3; br++) {
      for (let bc = 0; bc < 3; bc++) {
        const seen = {};
        for (let r = br * 3; r < br * 3 + 3; r++) {
          for (let c = bc * 3; c < bc * 3 + 3; c++) {
            const v = grid[r][c];
            if (!v) continue;
            if (!seen[v]) {
              seen[v] = [];
            }
            seen[v].push([r, c]);
          }
        }
        Object.values(seen).forEach((cells) => {
          if (cells.length > 1) {
            cells.forEach(([rr, cc]) => addConflict(rr, cc));
          }
        });
      }
    }

    return conflictsSet;
  };

  const handleCellChange = (row, col, val) => {
    if (!puzzle || !userGrid) return;
    // Prevent editing original givens
    if (puzzle[row][col] !== 0) return;

    const trimmed = val.trim();
    const numeric = trimmed === '' ? 0 : Number(trimmed);

    if (!(numeric === 0 || (Number.isInteger(numeric) && numeric >= 1 && numeric <= 9))) {
      return;
    }

    const nextGrid = userGrid.map((r, ri) =>
      r.map((cell, ci) => {
        if (ri === row && ci === col) {
          return numeric;
        }
        return cell;
      })
    );

    setUserGrid(nextGrid);

    const nextConflicts = computeConflicts(nextGrid);
    setConflicts(nextConflicts);

    const allFilled = nextGrid.every((r) => r.every((v) => v !== 0));

    if (solution && allFilled) {
      const matchesSolution = nextGrid.every((r, ri) => r.every((v, ci) => v === solution[ri][ci]));
      if (matchesSolution) {
        setValidationMessage('Beautiful! This Sudoku is solved correctly.');
        setValidationState('success');
        return;
      }

      if (nextConflicts.size === 0) {
        setValidationMessage('The grid is full but some numbers do not match the solution.');
        setValidationState('error');
        return;
      }
    }

    if (nextConflicts.size > 0) {
      setValidationMessage('There are conflicts in the grid. Fix the highlighted cells.');
      setValidationState('error');
    } else if (numeric === 0 && !allFilled) {
      setValidationMessage('');
      setValidationState('idle');
    } else if (!allFilled) {
      setValidationMessage('Looking good so far. No rule violations detected.');
      setValidationState('info');
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setValidationMessage('');
    setValidationState('idle');

    try {
      const res = await fetch(`${API_URL}/api/puzzles/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'sudoku', difficulty })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate puzzle');
      }

      const data = await res.json();
      setPuzzle(data.puzzle);
      setUserGrid(data.puzzle);
      setSolution(data.solution || null);
      setLastGeneratedId(data.id);
      setConflicts(new Set());
    } catch (e) {
      console.error(e);
      setError(e.message || 'Something went wrong while contacting the API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <AppShell>
        <Card>
          <Header>
            <TitleBlock>
              <Title>Logic Puzzle Generator</Title>
              <Subtitle>Generate fresh Sudoku grids on demand, then extend into Nonograms and logic grids.</Subtitle>
            </TitleBlock>
            <Badge>Sudoku · v1</Badge>
          </Header>

          <Content>
            <SudokuBoard
              puzzle={puzzle}
              userGrid={userGrid}
              conflicts={conflicts}
              onCellChange={handleCellChange}
            />

            <Sidebar>
              <DifficultySelector value={difficulty} onChange={setDifficulty} />

              <div>
                <PrimaryButton onClick={handleGenerate} disabled={loading}>
                  {loading ? 'Generating…' : 'Generate Puzzle'}
                </PrimaryButton>
                {error && <ErrorText>{error}</ErrorText>}
                {!error && validationMessage && (
                  <ValidationBlock>
                    {validationState === 'success' && <SuccessText>{validationMessage}</SuccessText>}
                    {validationState === 'error' && <ErrorText>{validationMessage}</ErrorText>}
                    {validationState === 'info' && <InfoText>{validationMessage}</InfoText>}
                  </ValidationBlock>
                )}
              </div>
            </Sidebar>
          </Content>
        </Card>
      </AppShell>
    </>
  );
}

export default App;

