import React from 'react';
import styled from 'styled-components';

const Panel = styled.section`
  padding: 0.9rem 1rem 1.1rem;
  border-radius: 14px;
  background: radial-gradient(circle at top left, rgba(30, 64, 175, 0.32), rgba(15, 23, 42, 0.96));
  border: 1px solid rgba(148, 163, 184, 0.4);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.p`
  margin: 0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #cbd5f5;
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: #9ca3af;
`;

const Options = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.45rem;
  flex-wrap: wrap;
`;

const OptionButton = styled.button`
  flex: 1 1 0;
  min-width: 0;
  border-radius: 999px;
  padding: 0.5rem 0.8rem;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(96, 165, 250, 0.9)' : 'rgba(148, 163, 184, 0.4)')};
  background: ${({ $active }) =>
    $active ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(59, 130, 246, 0.9))' : 'rgba(15, 23, 42, 0.9)'};
  color: ${({ $active }) => ($active ? '#eff6ff' : '#e5e7eb')};
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  white-space: nowrap;
  transition: background 0.12s ease, border-color 0.12s ease, transform 0.08s ease, box-shadow 0.08s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.8);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

export function DifficultySelector({ value, onChange }) {
  const options = [
    { id: 'easy', label: 'Easy', hint: 'More givens, gentle warm-up.' },
    { id: 'medium', label: 'Medium', hint: 'Balanced challenge.' },
    { id: 'hard', label: 'Hard', hint: 'Sparse clues, deeper logic.' }
  ];

  const selected = options.find((opt) => opt.id === value) ?? options[1];

  return (
    <Panel>
      <Label>Difficulty</Label>
      <Description>{selected.hint}</Description>
      <Options>
        {options.map((opt) => (
          <OptionButton key={opt.id} $active={opt.id === value} onClick={() => onChange(opt.id)}>
            {opt.label}
          </OptionButton>
        ))}
      </Options>
    </Panel>
  );
}

