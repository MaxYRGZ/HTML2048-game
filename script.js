const grid = document.getElementById('grid');
const scoreElement = document.getElementById('score');
const bestElement = document.getElementById('best');
let score = 0;
let best = 0;
let board = [];
let previousBoard = [];

function initializeBoard() {
    board = Array(16).fill(0);
    addNewTile();
    addNewTile();
    updateGrid();
}

function addNewTile() {
    const emptyTiles = board.reduce((acc, val, index) => {
        if (val === 0) acc.push(index);
        return acc;
    }, []);
    if (emptyTiles.length > 0) {
        const randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateGrid() {
    grid.innerHTML = '';
    board.forEach((value, index) => {
        const cell = document.createElement('div');
        cell.className = `cell ${value ? 'cell-' + value : ''}`;
        cell.textContent = value || '';
        grid.appendChild(cell);
    });
}

function updateScore() {
    scoreElement.textContent = score;
    if (score > best) {
        best = score;
        bestElement.textContent = best;
    }
}

function newGame() {
    score = 0;
    updateScore();
    initializeBoard();
}

function undo() {
    board = [...previousBoard];
    updateGrid();
}

function shuffle() {
    board = board.sort(() => Math.random() - 0.5);
    updateGrid();
}

function showLeaderboard() {
    // Implement leaderboard functionality
    console.log('Leaderboard clicked');
}

function showSettings() {
    // Implement settings functionality
    console.log('Settings clicked');
}

function slide(row) {
    const newRow = row.filter(val => val);
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            score += newRow[i];
            newRow[i + 1] = 0;
        }
    }
    return [...newRow.filter(val => val), ...Array(4 - newRow.filter(val => val).length).fill(0)];
}

function rotateLeft(board) {
    const newBoard = Array(16).fill(0);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            newBoard[i * 4 + j] = board[j * 4 + (3 - i)];
        }
    }
    return newBoard;
}

function moveLeft() {
    previousBoard = [...board];
    for (let i = 0; i < 4; i++) {
        const row = board.slice(i * 4, i * 4 + 4);
        const newRow = slide(row);
        board.splice(i * 4, 4, ...newRow);
    }
    addNewTile();
    updateGrid();
    updateScore();
}

function moveRight() {
    previousBoard = [...board];
    for (let i = 0; i < 4; i++) {
        const row = board.slice(i * 4, i * 4 + 4).reverse();
        const newRow = slide(row).reverse();
        board.splice(i * 4, 4, ...newRow);
    }
    addNewTile();
    updateGrid();
    updateScore();
}

function moveUp() {
    previousBoard = [...board];
    board = rotateLeft(board);
    moveLeft();
    board = rotateLeft(board);
    board = rotateLeft(board);
    board = rotateLeft(board);
    addNewTile();
    updateGrid();
    updateScore();
}

function moveDown() {
    previousBoard = [...board];
    board = rotateLeft(board);
    board = rotateLeft(board);
    board = rotateLeft(board);
    moveLeft();
    board = rotateLeft(board);
    addNewTile();
    updateGrid();
    updateScore();
}

// Initialize the game
newGame();

// Add keyboard controls
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
    }
});
