/* ============================================
   SUDOKU PUZZLE GENERATOR - JAVASCRIPT
   ============================================
   
   This file contains all the logic for:
   - Generating valid Sudoku puzzles
   - Solving Sudoku puzzles
   - Managing the user interface
   - Checking solutions
   - Highlighting errors
*/

// ============================================
// GLOBAL VARIABLES
// ============================================

// Stores the current puzzle (including given clues)
let currentPuzzle = [];

// Stores the solution to the current puzzle
let currentSolution = [];

// Stores the user's current attempts/answers
let currentUserInput = [];

// ============================================
// SUDOKU GENERATOR AND SOLVER FUNCTIONS
// ============================================

/**
 * Checks if a number can be placed at a specific position
 * following Sudoku rules (no duplicates in row, column, or 3x3 box)
 * 
 * @param {Array} board - The Sudoku board (9x9 array)
 * @param {number} row - Row index (0-8)
 * @param {number} col - Column index (0-8)
 * @param {number} num - Number to check (1-9)
 * @returns {boolean} - True if number can be placed, false otherwise
 */
function isValid(board, row, col, num) {
    // Check row: make sure num doesn't already exist in this row
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) {
            return false;
        }
    }

    // Check column: make sure num doesn't already exist in this column
    for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) {
            return false;
        }
    }

    // Check 3x3 box: find the top-left corner of the box
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);

    // Make sure num doesn't already exist in this 3x3 box
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (board[r][c] === num) {
                return false;
            }
        }
    }

    return true;
}

/**
 * Solves a Sudoku puzzle using backtracking algorithm
 * This finds the solution to a given puzzle
 * 
 * @param {Array} board - The Sudoku board (9x9 array)
 * @returns {boolean} - True if puzzle is solvable, false otherwise
 */
function solveSudoku(board) {
    // Try to find an empty cell
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            // If cell is empty (0)
            if (board[row][col] === 0) {
                // Try numbers 1-9
                for (let num = 1; num <= 9; num++) {
                    // If number is valid in this position
                    if (isValid(board, row, col, num)) {
                        // Place the number
                        board[row][col] = num;

                        // Recursively try to solve the rest of the puzzle
                        if (solveSudoku(board)) {
                            return true; // Puzzle solved!
                        }

                        // If solving failed, backtrack and try next number
                        board[row][col] = 0;
                    }
                }
                // No valid number found, puzzle unsolvable
                return false;
            }
        }
    }
    // No empty cells found, puzzle is solved
    return true;
}

/**
 * Generates a valid Sudoku puzzle by:
 * 1. Creating a solved puzzle
 * 2. Randomly removing numbers to create a puzzle
 * 
 * @returns {Object} - Object with puzzle and solution arrays
 */
function generateSudokuPuzzle() {
    // Create an empty board filled with zeros
    const board = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));

    // Fill diagonal 3x3 boxes with random numbers (they don't conflict)
    for (let box = 0; box < 3; box++) {
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]); // Random order

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[box * 3 + i][box * 3 + j] = numbers[i * 3 + j];
            }
        }
    }

    // Solve the board to get a complete valid puzzle
    solveSudoku(board);

    // Save the complete solution
    const solution = board.map(row => [...row]); // Deep copy

    // Now remove numbers to create the puzzle
    // We remove numbers randomly, aiming for about 40-50 clues remaining
    const cellsToRemove = 40 + Math.floor(Math.random() * 10); // Remove 40-50 numbers
    let removed = 0;

    while (removed < cellsToRemove) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (board[row][col] !== 0) {
            board[row][col] = 0;
            removed++;
        }
    }

    return {
        puzzle: board,
        solution: solution
    };
}

/**
 * Shuffles an array using Fisher-Yates shuffle algorithm
 * This randomizes the order of elements
 * 
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
function shuffle(array) {
    // Create a copy to avoid modifying original
    const arr = [...array];

    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
        // Random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

// ============================================
// UI FUNCTIONS
// ============================================

/**
 * Creates and renders the Sudoku grid in the HTML
 * Generates 81 cells (9x9) with appropriate input fields
 */
function renderSudokuGrid() {
    const grid = document.getElementById('sudokuGrid');
    grid.innerHTML = ''; // Clear existing grid

    // Create 81 cells (9 rows × 9 columns)
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            // Create a cell container
            const cell = document.createElement('div');
            cell.className = 'sudoku-cell';
            cell.id = `cell-${row}-${col}`;

            const value = currentPuzzle[row][col];

            if (value !== 0) {
                // This is a given clue - not editable
                cell.classList.add('given');
                cell.textContent = value;
            } else {
                // This is an empty cell - add input field
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1; // Only 1 digit allowed
                input.id = `input-${row}-${col}`;
                input.dataset.row = row;
                input.dataset.col = col;

                // Set value if user already entered something
                if (currentUserInput[row][col] !== 0) {
                    input.value = currentUserInput[row][col];
                }

                // Add event listeners for user input
                input.addEventListener('input', handleCellInput);
                input.addEventListener('keydown', handleKeyboard);

                cell.appendChild(input);
            }

            grid.appendChild(cell);
        }
    }
}

/**
 * Handles when user types in a cell
 * Only allows digits 1-9 and clears invalid input
 */
function handleCellInput(event) {
    const input = event.target;
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);

    // Allow only digits 1-9
    if (input.value && !/^[1-9]$/.test(input.value)) {
        input.value = ''; // Clear invalid input
        currentUserInput[row][col] = 0;
        return;
    }

    // Store the value in our tracking array
    currentUserInput[row][col] = input.value ? parseInt(input.value) : 0;

    // Move to next cell automatically if valid digit entered
    if (input.value && /^[1-9]$/.test(input.value)) {
        moveToNextCell(row, col);
    }
}

/**
 * Handles keyboard navigation in the grid
 * Allows arrow keys to move between cells
 */
function handleKeyboard(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    switch (event.key) {
        case 'ArrowUp':
            event.preventDefault();
            if (row > 0) focusCell(row - 1, col);
            break;
        case 'ArrowDown':
            event.preventDefault();
            if (row < 8) focusCell(row + 1, col);
            break;
        case 'ArrowLeft':
            event.preventDefault();
            if (col > 0) focusCell(row, col - 1);
            break;
        case 'ArrowRight':
            event.preventDefault();
            if (col < 8) focusCell(row, col + 1);
            break;
        case 'Delete':
        case 'Backspace':
            event.preventDefault();
            event.target.value = '';
            currentUserInput[row][col] = 0;
            break;
    }
}

/**
 * Moves focus to the next empty cell
 */
function moveToNextCell(row, col) {
    // Try to move right first
    for (let c = col + 1; c < 9; c++) {
        const input = document.getElementById(`input-${row}-${c}`);
        if (input) {
            input.focus();
            return;
        }
    }

    // If end of row, move to next row
    for (let r = row + 1; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const input = document.getElementById(`input-${r}-${c}`);
            if (input) {
                input.focus();
                return;
            }
        }
    }
}

/**
 * Moves focus to a specific cell
 */
function focusCell(row, col) {
    const input = document.getElementById(`input-${row}-${col}`);
    if (input) {
        input.focus();
    }
}

/**
 * Shows a message to the user
 * 
 * @param {string} message - The message to display
 * @param {string} type - Message type: 'success', 'error', or 'warning'
 */
function showMessage(message, type = 'info') {
    const messageArea = document.getElementById('messageArea');
    messageArea.textContent = message;
    messageArea.className = `message-area show ${type}`;

    // Auto-hide message after 4 seconds
    setTimeout(() => {
        messageArea.classList.remove('show');
    }, 4000);
}

/**
 * Clears all error highlights from cells
 */
function clearErrorHighlights() {
    document.querySelectorAll('.sudoku-cell.wrong').forEach(cell => {
        cell.classList.remove('wrong');
    });
}

/**
 * Checks the user's solution against the correct solution
 * Highlights any wrong entries
 */
function checkSolution() {
    clearErrorHighlights();

    let hasErrors = false;
    let isComplete = true;

    // Check each cell
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const userValue = currentUserInput[row][col];

            // Check if user left empty cells
            if (userValue === 0) {
                isComplete = false;
                continue;
            }

            // Check if user's answer matches solution
            if (userValue !== currentSolution[row][col]) {
                hasErrors = true;
                const cell = document.getElementById(`cell-${row}-${col}`);
                cell.classList.add('wrong'); // Highlight wrong cell
            }
        }
    }

    // Display appropriate message
    if (!isComplete) {
        showMessage('⚠️ Please fill in all cells before checking!', 'warning');
    } else if (hasErrors) {
        showMessage('❌ Some entries are incorrect. Check the highlighted cells!', 'error');
    } else {
        showMessage('🎉 Congratulations! Your solution is correct!', 'success');
    }
}

/**
 * Generates a new puzzle and resets the game
 */
function generateNewPuzzle() {
    // Generate a new puzzle
    const generated = generateSudokuPuzzle();
    currentPuzzle = generated.puzzle;
    currentSolution = generated.solution;

    // Reset user input
    currentUserInput = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));

    // Clear any error messages
    clearErrorHighlights();

    // Re-render the grid
    renderSudokuGrid();

    // Show feedback
    showMessage('✨ New puzzle generated! Good luck!', 'success');
}

/**
 * Clears all user input but keeps the puzzle clues
 */
function clearAllInput() {
    // Reset user input array
    currentUserInput = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));

    // Clear all input fields
    document.querySelectorAll('.sudoku-cell input').forEach(input => {
        input.value = '';
    });

    // Remove error highlights
    clearErrorHighlights();

    // Show feedback
    showMessage('🔄 All entries cleared!', 'warning');
}

// ============================================
// EVENT LISTENERS AND INITIALIZATION
// ============================================

/**
 * Initialize the application when the page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    // Set up button click listeners
    document.getElementById('newPuzzleBtn').addEventListener('click', generateNewPuzzle);
    document.getElementById('checkSolutionBtn').addEventListener('click', checkSolution);
    document.getElementById('clearPuzzleBtn').addEventListener('click', clearAllInput);

    // Generate the first puzzle when page loads
    generateNewPuzzle();
});
