class MazePuzzle extends Puzzle {
    constructor(config) {
        super(config);
        this.gridSize = config.gridSize || 8;
        this.cellSize = config.cellSize || 40;
        this.playerPos = { x: 0, y: 0 };
        this.exitPos = { x: this.gridSize - 1, y: this.gridSize - 1 };
        this.maze = this.generateMaze();
    }

    generateMaze() {
        // Simple maze generation for demo
        const maze = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(0));
        // Add some walls (1 represents walls)
        maze[1][1] = 1;
        maze[1][2] = 1;
        maze[2][1] = 1;
        maze[3][3] = 1;
        maze[3][4] = 1;
        maze[4][3] = 1;
        return maze;
    }

    createPuzzleElement() {
        const element = document.createElement('div');
        element.className = 'puzzle maze-puzzle';
        element.innerHTML = `
            <div class="puzzle-content">
                <h3 class="neon-text">Escape the Digital Maze</h3>
                <canvas class="maze-canvas"></canvas>
                <p class="instructions">Use arrow keys to navigate through the maze</p>
            </div>
        `;
        return element;
    }

    initialize(container) {
        super.initialize(container);
        this.canvas = this.element.querySelector('.maze-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.gridSize * this.cellSize;
        this.canvas.height = this.gridSize * this.cellSize;
        this.drawMaze();
        this.attachEventListeners();
    }

    drawMaze() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const cell = this.maze[y][x];
                this.ctx.fillStyle = cell === 1 ? '#00ffff' : '#000';
                this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                this.ctx.strokeStyle = '#003333';
                this.ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
            }
        }

        // Draw player
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.fillRect(
            this.playerPos.x * this.cellSize + 5,
            this.playerPos.y * this.cellSize + 5,
            this.cellSize - 10,
            this.cellSize - 10
        );

        // Draw exit
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(
            this.exitPos.x * this.cellSize + 5,
            this.exitPos.y * this.cellSize + 5,
            this.cellSize - 10,
            this.cellSize - 10
        );
    }

    attachEventListeners() {
        document.addEventListener('keydown', (e) => this.handleMovement(e));
    }

    handleMovement(e) {
        const newPos = { ...this.playerPos };

        switch (e.key) {
            case 'ArrowUp':
                newPos.y--;
                break;
            case 'ArrowDown':
                newPos.y++;
                break;
            case 'ArrowLeft':
                newPos.x--;
                break;
            case 'ArrowRight':
                newPos.x++;
                break;
        }

        if (this.isValidMove(newPos)) {
            this.playerPos = newPos;
            this.drawMaze();
            this.checkWin();
        }
    }

    isValidMove(pos) {
        return (
            pos.x >= 0 &&
            pos.x < this.gridSize &&
            pos.y >= 0 &&
            pos.y < this.gridSize &&
            this.maze[pos.y][pos.x] !== 1
        );
    }

    checkWin() {
        if (this.playerPos.x === this.exitPos.x && this.playerPos.y === this.exitPos.y) {
            this.showSuccess();
        }
    }
}

class ColorSequencePuzzle extends Puzzle {
    constructor(config) {
        super(config);
        this.sequence = config.sequence || ['yellow', 'green', 'blue'];
        this.playerSequence = [];
        this.clue = config.clue || 'Sun, Grass, Sky';
    }

    createPuzzleElement() {
        const element = document.createElement('div');
        element.className = 'puzzle color-sequence';
        element.innerHTML = `
            <div class="puzzle-content">
                <h3 class="neon-text">Color Code Sequence</h3>
                <p class="sequence-clue">${this.clue}</p>
                <div class="color-buttons">
                    <button class="color-btn" data-color="yellow" style="background-color: yellow"></button>
                    <button class="color-btn" data-color="green" style="background-color: green"></button>
                    <button class="color-btn" data-color="blue" style="background-color: blue"></button>
                </div>
                <div class="sequence-display"></div>
            </div>
        `;
        return element;
    }

    attachEventListeners() {
        const buttons = this.element.querySelectorAll('.color-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => this.handleColorClick(btn.dataset.color));
        });
    }

    handleColorClick(color) {
        this.playerSequence.push(color);
        this.updateDisplay();

        if (this.playerSequence.length === this.sequence.length) {
            this.checkSequence();
        }
    }

    updateDisplay() {
        const display = this.element.querySelector('.sequence-display');
        display.innerHTML = this.playerSequence.map(color =>
            `<div class="sequence-dot" style="background-color: ${color}"></div>`
        ).join('');
    }

    checkSequence() {
        const correct = this.playerSequence.every(
            (color, index) => color === this.sequence[index]
        );

        if (correct) {
            this.showSuccess();
        } else {
            this.playerSequence = [];
            this.updateDisplay();
            this.showError();
        }
    }
}