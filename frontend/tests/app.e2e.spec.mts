import { test, expect } from '@playwright/test';

test.describe('Logic Puzzle Generator - Sudoku flow', () => {
  test('generates a puzzle and allows valid interaction', async ({ page }) => {
    // Assumes backend running at http://localhost:4000 and frontend dev server at baseURL
    await page.goto('/');

    await expect(page.getByText('Logic Puzzle Generator')).toBeVisible();

    // No puzzle yet state
    await expect(page.getByText('No puzzle yet')).toBeVisible();

    // Generate a puzzle
    const generateButton = page.getByRole('button', { name: /generate puzzle/i });
    await generateButton.click();

    // Wait for board to populate
    const grid = page.getByTestId('sudoku-grid');
    await expect(grid).toBeVisible();

    // Find a blank cell (an input element) and type a valid digit
    const editableCellInput = page.getByTestId('sudoku-cell-input').first();
    await editableCellInput.fill('5');
    await expect(editableCellInput).toHaveValue('5');
  });
});

