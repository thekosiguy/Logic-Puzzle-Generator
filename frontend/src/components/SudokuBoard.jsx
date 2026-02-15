import React from 'react';
import styled from 'styled-components';

const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const BoardTitle = styled.h2`
  margin: 0;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #e5e7eb;
`;

const BoardSub = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #9ca3af;
`;

const Grid = styled.div.attrs({ 'data-testid': 'sudoku-grid' })`
  margin-top: 0.75rem;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    0 0 0 2px rgba(148, 163, 184, 0.35),
    inset 0 0 0 1px rgba(15, 23, 42, 0.8);
  background: radial-gradient(circle at top left, #0f172a, #020617);
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(0.9rem, 1.2vw, 1.1rem);
  color: ${({ $isFixed, $isRevealed }) =>
    $isRevealed ? '#86efac' : $isFixed ? '#e5e7eb' : '#cbd5f5'};
  background-color: ${({ $band, $isRevealed }) =>
    $isRevealed ? 'rgba(34, 197, 94, 0.12)' : $band ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.7)'};
  border-right: 1px solid
    ${({ $isConflict }) => ($isConflict ? 'rgba(248, 113, 113, 0.95)' : 'rgba(51, 65, 85, 0.6)')};
  border-bottom: 1px solid
    ${({ $isConflict }) => ($isConflict ? 'rgba(248, 113, 113, 0.95)' : 'rgba(51, 65, 85, 0.6)')};
  box-shadow: ${({ $isConflict }) =>
    $isConflict ? 'inset 0 0 0 1px rgba(239, 68, 68, 0.9)' : 'none'};

  &:nth-child(9n) {
    border-right: none;
  }
`;

const CellInput = styled.input.attrs({ 'data-testid': 'sudoku-cell-input' })`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  text-align: center;
  font: inherit;
  background: transparent;
  color: inherit;
  padding: 0;
  caret-color: #facc15;

  &::placeholder {
    color: transparent;
  }

  &:disabled {
    cursor: default;
  }
`;

const EmptyState = styled.div`
  border-radius: 14px;
  border: 1px dashed rgba(148, 163, 184, 0.5);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  justify-content: center;
  align-items: flex-start;
  min-height: 260px;
`;

const EmptyTitle = styled.p`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
`;

const EmptyText = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #9ca3af;
`;

export function SudokuBoard({ puzzle, userGrid, solution, showSolution, conflicts, onCellChange }) {
  if (!puzzle) {
    return (
      <BoardWrapper>
        <BoardTitle>Sudoku board</BoardTitle>
        <BoardSub>Choose a difficulty and generate your first puzzle.</BoardSub>
        <EmptyState>
          <EmptyTitle>No puzzle yet</EmptyTitle>
          <EmptyText>Generate a fresh grid to start solving!</EmptyText>
        </EmptyState>
      </BoardWrapper>
    );
  }

  const isShowingSolution = showSolution && solution;
  const gridToRender = isShowingSolution ? solution : (userGrid || puzzle);

  return (
    <BoardWrapper>
      <BoardTitle>Sudoku board</BoardTitle>
      <BoardSub>
        {isShowingSolution
          ? <><strong>Solution</strong> - generate a new puzzle to play again.</>
          : 'Click into blank cells and type 1–9 to solve. Conflicts will glow red.'}
      </BoardSub>
      <Grid>
        {gridToRender.flat().map((value, index) => {
          const row = Math.floor(index / 9);
          const col = index % 9;
          const isBand = (Math.floor(row / 3) + Math.floor(col / 3)) % 2 === 0;
          const wasGiven = puzzle[row][col] !== 0;
          const isFixed = isShowingSolution || wasGiven;
          const isConflict = !isShowingSolution && conflicts?.has?.(`${row}-${col}`);
          const isRevealed = isShowingSolution && !wasGiven;

          return (
            <Cell key={index} $isFixed={isFixed} $band={isBand} $isConflict={isConflict} $isRevealed={isRevealed}>
              {isShowingSolution || wasGiven ? (
                value
              ) : (
                <CellInput
                  inputMode="numeric"
                  maxLength={1}
                  value={value === 0 ? '' : String(value)}
                  onChange={(e) => onCellChange?.(row, col, e.target.value)}
                />
              )}
            </Cell>
          );
        })}
      </Grid>
    </BoardWrapper>
  );
}

