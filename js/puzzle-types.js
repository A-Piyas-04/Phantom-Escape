// Additional Puzzle Type Implementations

class RiddlePuzzle extends Puzzle {
    constructor(config) {
        super(config);
        this.riddle = config.riddle;
        this.answer = config.answer;
    }

    createPuzzleElement() {
        const element = document.createElement('div');
        element.className = 'puzzle riddle';
        element.innerHTML = `
            <div class="puzzle-content">
                <h3>Solve the Riddle</h3>
                <p class="riddle-text">${this.riddle}</p>
                <div class="riddle-input">
                    <input type="text" class="answer-input" placeholder="Enter your answer..." />
                    <button class="submit-btn">Submit</button>
                </div>
            </div>
        `;
        return element;
    }

    attachEventListeners() {
        const submitBtn = this.element.querySelector('.submit-btn');
        const input = this.element.querySelector('.answer-input');

        submitBtn.addEventListener('click', () => this.validate());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.validate();
        });
    }

    validate() {
        const input = this.element.querySelector('.answer-input');
        if (input.value.toLowerCase().trim() === this.answer.toLowerCase().trim()) {
            this.showSuccess();
        } else {
            this.showError();
        }
    }
}

class SlidingTilePuzzle extends Puzzle {
    constructor(config) {
        super(config);
        this.imageUrl = config.imageUrl;
        this.gridSize = config.gridSize || 3;
        this.tiles = [];
        this.emptyTile = null;
    }

    createPuzzleElement() {
        const element = document.createElement('div');
        element.className = 'puzzle sliding-tile';
        element.innerHTML = `
            <div class="puzzle-content">
                <h3>Sliding Tile Puzzle</h3>
                <div class="tile-grid" style="grid-template-columns: repeat(${this.gridSize}, 1fr)">
                </div>
            </div>
        `;
        return element;
    }

    async initialize(container) {
        await this.loadImage();
        super.initialize(container);
        this.createTiles();
        this.shuffleTiles();
    }

    async loadImage() {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.image = img;
                resolve();
            };
            img.onerror = reject;
            img.src = this.imageUrl;
        });
    }

    createTiles() {
        const grid = this.element.querySelector('.tile-grid');
        const tileSize = this.image.width / this.gridSize;

        for (let i = 0; i < this.gridSize * this.gridSize - 1; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.index = i;

            const x = (i % this.gridSize) * tileSize;
            const y = Math.floor(i / this.gridSize) * tileSize;

            tile.style.backgroundImage = `url(${this.imageUrl})`;
            tile.style.backgroundPosition = `-${x}px -${y}px`;
            tile.style.width = `${100 / this.gridSize}%`;
            tile.style.paddingBottom = `${100 / this.gridSize}%`;

            grid.appendChild(tile);
            this.tiles.push(tile);
        }

        // Add empty tile
        const emptyTile = document.createElement('div');
        emptyTile.className = 'tile empty';
        grid.appendChild(emptyTile);
        this.emptyTile = emptyTile;
    }

    shuffleTiles() {
        for (let i = this.tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            this.swapTiles(this.tiles[i], this.tiles[j]);
        }
    }

    swapTiles(tile1, tile2) {
        const temp = tile1.style.backgroundPosition;
        tile1.style.backgroundPosition = tile2.style.backgroundPosition;
        tile2.style.backgroundPosition = temp;

        const tempIndex = tile1.dataset.index;
        tile1.dataset.index = tile2.dataset.index;
        tile2.dataset.index = tempIndex;
    }

    attachEventListeners() {
        this.element.querySelector('.tile-grid').addEventListener('click', (e) => {
            const tile = e.target.closest('.tile');
            if (tile && !tile.classList.contains('empty')) {
                this.moveTile(tile);
            }
        });
    }

    moveTile(tile) {
        const tileRect = tile.getBoundingClientRect();
        const emptyRect = this.emptyTile.getBoundingClientRect();

        const isAdjacent = (
            (Math.abs(tileRect.left - emptyRect.left) < 1 && Math.abs(tileRect.top - emptyRect.top) === 0) ||
            (Math.abs(tileRect.top - emptyRect.top) < 1 && Math.abs(tileRect.left - emptyRect.left) === 0)
        );

        if (isAdjacent) {
            this.swapTiles(tile, this.emptyTile);
            this.validate();
        }
    }

    validate() {
        const isCorrect = this.tiles.every(tile => {
            const currentIndex = parseInt(tile.dataset.index);
            const correctPosition = tile.style.backgroundPosition;
            const x = (currentIndex % this.gridSize) * (this.image.width / this.gridSize);
            const y = Math.floor(currentIndex / this.gridSize) * (this.image.width / this.gridSize);
            const expectedPosition = `-${x}px -${y}px`;
            return correctPosition === expectedPosition;
        });

        if (isCorrect) {
            this.showSuccess();
        }
    }
}


class MathLogicPuzzle extends Puzzle {
    constructor(config) {
        super(config);
        this.problem = config.problem;
        this.answer = config.answer;
        this.explanation = config.explanation;
    }

    createPuzzleElement() {
        const element = document.createElement('div');
        element.className = 'puzzle math-logic';
        element.innerHTML = `
            <div class="puzzle-content">
                <h3>Math Logic Puzzle</h3>
                <p class="problem-text">${this.problem}</p>
                <div class="math-input">
                    <input type="number" class="answer-input" 
                           placeholder="Enter your answer..." />
                    <button class="submit-btn">Check</button>
                </div>
                <p class="explanation hidden">${this.explanation}</p>
            </div>
        `;
        return element;
    }

    attachEventListeners() {
        const submitBtn = this.element.querySelector('.submit-btn');
        const input = this.element.querySelector('.answer-input');

        submitBtn.addEventListener('click', () => this.validate());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.validate();
        });
    }

    validate() {
        const input = this.element.querySelector('.answer-input');
        const explanation = this.element.querySelector('.explanation');
        
        if (parseInt(input.value) === this.answer) {
            explanation.classList.remove('hidden');
            this.showSuccess();
        } else {
            this.showError();
        }
    }
}

class LaserMazePuzzle extends Puzzle {
    constructor(config) {
        super(config);
        this.grid = config.grid;
        this.startPoint = config.startPoint;
        this.targetPoint = config.targetPoint;
        this.mirrors = new Set();
    }

    createPuzzleElement() {
        const element = document.createElement('div');
        element.className = 'puzzle laser-maze';
        element.innerHTML = `
            <div class="puzzle-content">
                <h3>Laser Maze</h3>
                <div class="laser-grid">
                    ${this.createGrid()}
                </div>
                <div class="controls">
                    <button class="test-btn">Test Laser Path</button>
                </div>
            </div>
        `;
        return element;
    }

    createGrid() {
        return this.grid.map((row, y) => `
            <div class="grid-row">
                ${row.map((cell, x) => `
                    <div class="grid-cell" data-x="${x}" data-y="${y}">
                        ${this.getCellContent(cell, x, y)}
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    getCellContent(cell, x, y) {
        if (x === this.startPoint.x && y === this.startPoint.y) {
            return '<div class="laser-source">→</div>';
        }
        if (x === this.targetPoint.x && y === this.targetPoint.y) {
            return '<div class="laser-target">⊙</div>';
        }
        if (cell === 1) { // Mirror placement spot
            return '<div class="mirror-spot"></div>';
        }
        return '';
    }

    attachEventListeners() {
        const grid = this.element.querySelector('.laser-grid');
        const testBtn = this.element.querySelector('.test-btn');

        grid.addEventListener('click', (e) => {
            const cell = e.target.closest('.grid-cell');
            if (cell && cell.querySelector('.mirror-spot')) {
                this.toggleMirror(cell);
            }
        });

        testBtn.addEventListener('click', () => this.testLaserPath());
    }

    toggleMirror(cell) {
        const mirror = cell.querySelector('.mirror') || document.createElement('div');
        if (!cell.contains(mirror)) {
            mirror.className = 'mirror';
            mirror.style.transform = 'rotate(45deg)';
            cell.appendChild(mirror);
            this.mirrors.add(cell);
        } else {
            const currentRotation = parseFloat(mirror.style.transform.match(/\d+/) || 45);
            if (currentRotation >= 315) {
                mirror.remove();
                this.mirrors.delete(cell);
            } else {
                mirror.style.transform = `rotate(${currentRotation + 45}deg)`;
            }
        }
    }

    testLaserPath() {
        // Clear previous path
        this.element.querySelectorAll('.laser-beam').forEach(beam => beam.remove());

        let currentPoint = { ...this.startPoint };
        let direction = { x: 1, y: 0 }; // Initial direction: right
        const path = new Set();

        while (this.isInGrid(currentPoint)) {
            const cell = this.element.querySelector(
                `.grid-cell[data-x="${currentPoint.x}"][data-y="${currentPoint.y}"]`
            );

            const pathKey = `${currentPoint.x},${currentPoint.y}`;
            if (path.has(pathKey)) break; // Prevent infinite loops
            path.add(pathKey);

            this.drawLaserBeam(currentPoint);

            if (currentPoint.x === this.targetPoint.x && 
                currentPoint.y === this.targetPoint.y) {
                this.showSuccess();
                return;
            }

            const mirror = cell.querySelector('.mirror');
            if (mirror) {
                const rotation = parseFloat(mirror.style.transform.match(/\d+/) || 0);
                direction = this.reflectLaser(direction, rotation);
            }

            currentPoint.x += direction.x;
            currentPoint.y += direction.y;
        }

        this.showError();
    }

    isInGrid(point) {
        return point.x >= 0 && point.x < this.grid[0].length &&
               point.y >= 0 && point.y < this.grid.length;
    }

    drawLaserBeam(point) {
        const cell = this.element.querySelector(
            `.grid-cell[data-x="${point.x}"][data-y="${point.y}"]`
        );
        const beam = document.createElement('div');
        beam.className = 'laser-beam';
        cell.appendChild(beam);
    }

    reflectLaser(direction, mirrorRotation) {
        // Calculate new direction based on mirror rotation
        const rotationRad = (mirrorRotation * Math.PI) / 180;
        const newX = direction.x * Math.cos(2 * rotationRad) + 
                     direction.y * Math.sin(2 * rotationRad);
        const newY = direction.x * Math.sin(2 * rotationRad) - 
                     direction.y * Math.cos(2 * rotationRad);
        return { x: Math.round(newX), y: Math.round(newY) };
    }
}

class InvisibleInkPuzzle extends Puzzle {
    constructor(config) {
        super(config);
        this.hiddenMessage = config.hiddenMessage;
        this.revealThreshold = config.revealThreshold || 0.5;
        this.isRevealed = false;
    }

    createPuzzleElement() {
        const element = document.createElement('div');
        element.className = 'puzzle invisible-ink';
        element.innerHTML = `
            <div class="puzzle-content">
                <h3>Invisible Ink</h3>
                <div class="ink-area">
                    <div class="hidden-message">${this.hiddenMessage}</div>
                    <canvas class="reveal-canvas"></canvas>
                </div>
                <p class="instruction">Use your cursor to reveal the hidden message</p>
            </div>
        `;
        return element;
    }

    attachEventListeners() {
        const canvas = this.element.querySelector('.reveal-canvas');
        const ctx = canvas.getContext('2d');
        const inkArea = this.element.querySelector('.ink-area');

        // Set canvas size
        canvas.width = inkArea.offsetWidth;
        canvas.height = inkArea.offsetHeight;

        // Fill canvas with dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let isDrawing = false;
        const radius = 20;

        const reveal = (e) => {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();

            this.checkRevealProgress();
        };

        canvas.addEventListener('mousedown', () => isDrawing = true);
        canvas.addEventListener('mousemove', reveal);
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseleave', () => isDrawing = false);
    }

    checkRevealProgress() {
        if (this.isRevealed) return;

        const canvas = this.element.querySelector('.reveal-canvas');
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        let transparentPixels = 0;
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] < 128) transparentPixels++;
        }

        const progress = transparentPixels / (pixels.length / 4);
        if (progress > this.revealThreshold) {
            this.isRevealed = true;
            this.showSuccess();
        }
    }
}

class MazeNavigationPuzzle extends Puzzle {
    constructor(config) {
        super(config);
        this.maze = config.maze;
        this.startPos = config.startPos;
        this.endPos = config.endPos;
        this.playerPos = { ...this.startPos };
        this.path = [];
    }

    createPuzzleElement() {
        const element = document.createElement('div');
        element.className = 'puzzle maze-navigation';
        element.innerHTML = `
            <div class="puzzle-content">
                <h3>Maze Navigation</h3>
                <div class="maze-grid">
                    ${this.createMazeGrid()}
                </div>
                <div class="controls">
                    <button class="direction-btn up">↑</button>
                    <div class="horizontal-controls">
                        <button class="direction-btn left">←</button>
                        <button class="direction-btn right">→</button>
                    </div>
                    <button class="direction-btn down">↓</button>
                </div>
            </div>
        `;
        return element;
    }

    createMazeGrid() {
        return this.maze.map((row, y) => `
            <div class="maze-row">
                ${row.map((cell, x) => `
                    <div class="maze-cell ${this.getCellClass(x, y)}" 
                         data-x="${x}" data-y="${y}">
                        ${this.getCellContent(x, y)}
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    getCellClass(x, y) {
        if (this.maze[y][x] === 1) return 'wall';
        if (x === this.playerPos.x && y === this.playerPos.y) return 'player';
        if (x === this.startPos.x && y === this.startPos.y) return 'start';
        if (x === this.endPos.x && y === this.endPos.y) return 'end';
        if (this.path.some(pos => pos.x === x && pos.y === y)) return 'path';
        return '';
    }

    getCellContent(x, y) {
        if (x === this.playerPos.x && y === this.playerPos.y) return '◉';
        if (x === this.startPos.x && y === this.startPos.y) return 'S';
        if (x === this.endPos.x && y === this.endPos.y) return 'E';
        return '';
    }

    attachEventListeners() {
        const controls = this.element.querySelector('.controls');
        controls.addEventListener('click', (e) => {
            const btn = e.target.closest('.direction-btn');
            if (!btn) return;

            const direction = btn.classList[1];
            this.movePlayer(direction);
        });

        document.addEventListener('keydown', (e) => {
            if (!this.element.isConnected) return;
            
            const keyDirections = {
                'ArrowUp': 'up',
                'ArrowDown': 'down',
                'ArrowLeft': 'left',
                'ArrowRight': 'right'
            };

            if (keyDirections[e.key]) {
                e.preventDefault();
                this.movePlayer(keyDirections[e.key]);
            }
        });
    }

    movePlayer(direction) {
        const movements = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 }
        };

        const newPos = {
            x: this.playerPos.x + movements[direction].x,
            y: this.playerPos.y + movements[direction].y
        };

        if (this.isValidMove(newPos)) {
            this.path.push({ ...this.playerPos });
            this.playerPos = newPos;
            this.updateMaze();
            this.checkWin();
        }
    }

    isValidMove(pos) {
        return pos.x >= 0 && 
               pos.x < this.maze[0].length && 
               pos.y >= 0 && 
               pos.y < this.maze.length && 
               this.maze[pos.y][pos.x] !== 1;
    }

    updateMaze() {
        const cells = this.element.querySelectorAll('.maze-cell');
        cells.forEach(cell => {
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            cell.className = `maze-cell ${this.getCellClass(x, y)}`;
            cell.textContent = this.getCellContent(x, y);
        });
    }

    checkWin() {
        if (this.playerPos.x === this.endPos.x && 
            this.playerPos.y === this.endPos.y) {
            this.showSuccess();
        }
    }
}

class CaesarCipherPuzzle extends Puzzle {
    constructor(config) {
        super(config);
        this.encryptedMessage = config.encryptedMessage;
        this.shift = config.shift;
        this.solution = config.solution;
    }

    createPuzzleElement() {
        const element = document.createElement('div');
        element.className = 'puzzle caesar-cipher';
        element.innerHTML = `
            <div class="puzzle-content">
                <h3>Caesar Cipher</h3>
                <p class="encrypted-message">${this.encryptedMessage}</p>
                <p class="hint">Hint: Shift back by ${Math.abs(this.shift)}</p>
                <div class="cipher-input">
                    <input type="text" class="answer-input" 
                           placeholder="Enter your decoded message..." />
                    <button class="submit-btn">Submit</button>
                </div>
            </div>
        `;
        return element;
    }

    attachEventListeners() {
        const submitBtn = this.element.querySelector('.submit-btn');
        const input = this.element.querySelector('.answer-input');

        submitBtn.addEventListener('click', () => this.validate());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.validate();
        });
    }

    validate() {
        const input = this.element.querySelector('.answer-input');
        if (input.value.toLowerCase().trim() === this.solution.toLowerCase().trim()) {
            this.showSuccess();
        } else {
            this.showError();
        }
    }
}

class MorseCodePuzzle extends Puzzle {
    constructor(config) {
        super(config);
        this.encryptedMessage = config.encryptedMessage;
        this.solution = config.solution;
        this.morseCodeMap = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
            '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
            '8': '---..', '9': '----.',
        };
    }

    createPuzzleElement() {
        const element = document.createElement('div');
        element.className = 'puzzle morse-code';
        element.innerHTML = `
            <div class="puzzle-content">
                <h3>Morse Code</h3>
                <p class="encrypted-message">${this.encryptedMessage}</p>
                <p class="hint">Hint: Dots and dashes hold the key</p>
                <div class="morse-input">
                    <input type="text" class="answer-input" 
                           placeholder="Enter your decoded message..." />
                    <button class="submit-btn">Submit</button>
                </div>
                <div class="morse-reference">
                    ${this.createMorseReference()}
                </div>
            </div>
        `;
        return element;
    }

    createMorseReference() {
        return `
            <div class="reference-table">
                ${Object.entries(this.morseCodeMap).map(([letter, code]) => `
                    <div class="reference-item">
                        <span class="letter">${letter}</span>
                        <span class="code">${code}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    attachEventListeners() {
        const submitBtn = this.element.querySelector('.submit-btn');
        const input = this.element.querySelector('.answer-input');

        submitBtn.addEventListener('click', () => this.validate());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.validate();
        });
    }

    validate() {
        const input = this.element.querySelector('.answer-input');
        if (input.value.toUpperCase().trim() === this.solution.toUpperCase().trim()) {
            this.showSuccess();
        } else {
            this.showError();
        }
    }
}

class DifferenceSpottingPuzzle extends Puzzle {
    constructor(config) {
        super(config);
        this.image1Url = config.image1Url;
        this.image2Url = config.image2Url;
        this.differences = config.differences; // Array of {x, y, radius} coordinates
        this.foundDifferences = new Set();
    }

    createPuzzleElement() {
        const element = document.createElement('div');
        element.className = 'puzzle difference-spotting';
        element.innerHTML = `
            <div class="puzzle-content">
                <h3>Spot the Differences</h3>
                <div class="images-container">
                    <div class="image-wrapper">
                        <img src="${this.image1Url}" alt="Image 1" class="comparison-image" />
                        <div class="click-overlay" data-image="1"></div>
                    </div>
                    <div class="image-wrapper">
                        <img src="${this.image2Url}" alt="Image 2" class="comparison-image" />
                        <div class="click-overlay" data-image="2"></div>
                    </div>
                </div>
                <div class="progress-counter">
                    Found: <span class="differences-found">0</span>/${this.differences.length}
                </div>
            </div>
        `;
        return element;
    }

    attachEventListeners() {
        const overlays = this.element.querySelectorAll('.click-overlay');
        overlays.forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                const rect = overlay.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                this.checkDifference(x, y);
            });
        });
    }

    checkDifference(clickX, clickY) {
        for (let i = 0; i < this.differences.length; i++) {
            const diff = this.differences[i];
            const distance = Math.sqrt(
                Math.pow(clickX - diff.x, 2) + 
                Math.pow(clickY - diff.y, 2)
            );

            if (distance <= diff.radius && !this.foundDifferences.has(i)) {
                this.foundDifferences.add(i);
                this.markDifference(diff);
                this.updateProgress();
                this.validate();
                return;
            }
        }
        this.showError();
    }

    markDifference(diff) {
        const overlays = this.element.querySelectorAll('.click-overlay');
        overlays.forEach(overlay => {
            const marker = document.createElement('div');
            marker.className = 'difference-marker';
            marker.style.left = `${diff.x}%`;
            marker.style.top = `${diff.y}%`;
            overlay.appendChild(marker);
        });
    }

    updateProgress() {
        const counter = this.element.querySelector('.differences-found');
        counter.textContent = this.foundDifferences.size;
    }

    validate() {
        if (this.foundDifferences.size === this.differences.length) {
            this.showSuccess();
        }
    }
}

class GhostlyWhispersPuzzle extends Puzzle {
    constructor(config) {
        super(config);
        this.phrases = config.phrases; // Array of phrase objects {id, text}
        this.correctOrder = config.correctOrder; // Array of phrase IDs in correct order
        this.currentOrder = [];
    }

    createPuzzleElement() {
        const element = document.createElement('div');
        element.className = 'puzzle ghostly-whispers';
        element.innerHTML = `
            <div class="puzzle-content">
                <h3>Arrange the Ghostly Whispers</h3>
                <div class="phrases-container">
                    <div class="phrases-source">
                        ${this.phrases.map(phrase => `
                            <div class="phrase" draggable="true" data-id="${phrase.id}">
                                ${phrase.text}
                            </div>
                        `).join('')}
                    </div>
                    <div class="phrases-target">
                        <div class="drop-zone">Drop phrases here to arrange them</div>
                    </div>
                </div>
                <button class="check-btn">Check Order</button>
            </div>
        `;
        return element;
    }

    attachEventListeners() {
        const phrasesSource = this.element.querySelector('.phrases-source');
        const phrasesTarget = this.element.querySelector('.phrases-target');
        const checkBtn = this.element.querySelector('.check-btn');

        // Drag and drop event listeners
        this.element.querySelectorAll('.phrase').forEach(phrase => {
            phrase.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', phrase.dataset.id);
                phrase.classList.add('dragging');
            });

            phrase.addEventListener('dragend', () => {
                phrase.classList.remove('dragging');
            });
        });

        phrasesTarget.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(phrasesTarget, e.clientY);
            const draggable = this.element.querySelector('.dragging');
            if (afterElement) {
                phrasesTarget.insertBefore(draggable, afterElement);
            } else {
                phrasesTarget.appendChild(draggable);
            }
        });

        phrasesTarget.addEventListener('drop', (e) => {
            e.preventDefault();
            const phraseId = e.dataTransfer.getData('text/plain');
            const phrase = this.element.querySelector(`[data-id="${phraseId}"]`);
            if (!phrasesTarget.contains(phrase)) {
                phrasesTarget.appendChild(phrase);
            }
            this.updateCurrentOrder();
        });

        checkBtn.addEventListener('click', () => this.validate());
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.phrase:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    updateCurrentOrder() {
        this.currentOrder = Array.from(this.element.querySelectorAll('.phrases-target .phrase'))
            .map(phrase => phrase.dataset.id);
    }

    validate() {
        this.updateCurrentOrder();
        if (this.currentOrder.length !== this.correctOrder.length) {
            this.showError();
            return;
        }

        const isCorrect = this.currentOrder.every(
            (id, index) => id === this.correctOrder[index]
        );

        if (isCorrect) {
            this.showSuccess();
        } else {
            this.showError();
        }
    }
}



class CaesarCipherPuzzle extends Puzzle {
    constructor(config) {
        super(config);
        this.encryptedMessage = config.encryptedMessage;
        this.shift = config.shift;
        this.solution = config.solution;
    }

    createPuzzleElement() {
        const element = document.createElement('div');
        element.className = 'puzzle caesar-cipher';
        element.innerHTML = `
            <div class="puzzle-content">
                <h3>Caesar Cipher</h3>
                <p class="encrypted-message">${this.encryptedMessage}</p>
                <p class="hint">Hint: Shift back by ${Math.abs(this.shift)}</p>
                <div class="cipher-input">
                    <input type="text" class="answer-input" 
                           placeholder="Enter your decoded message..." />
                    <button class="submit-btn">Submit</button>
                </div>
            </div>
        `;
        return element;
    }

    attachEventListeners() {
        const submitBtn = this.element.querySelector('.submit-btn');
        const input = this.element.querySelector('.answer-input');

        submitBtn.addEventListener('click', () => this.validate());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.validate();
        });
    }

    validate() {
        const input = this.element.querySelector('.answer-input');
        if (input.value.toLowerCase().trim() === this.solution.toLowerCase().trim()) {
            this.showSuccess();
        } else {
            this.showError();
        }
    }
}

class MorseCodePuzzle extends Puzzle {
    constructor(config) {
        super(config);
        this.encryptedMessage = config.encryptedMessage;
        this.solution = config.solution;
        this.morseCodeMap = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
            '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
            '8': '---..', '9': '----.',
        };
    }

    createPuzzleElement() {
        const element = document.createElement('div');
        element.className = 'puzzle morse-code';
        element.innerHTML = `
            <div class="puzzle-content">
                <h3>Morse Code</h3>
                <p class="encrypted-message">${this.encryptedMessage}</p>
                <p class="hint">Hint: Dots and dashes hold the key</p>
                <div class="morse-input">
                    <input type="text" class="answer-input" 
                           placeholder="Enter your decoded message..." />
                    <button class="submit-btn">Submit</button>
                </div>
                <div class="morse-reference">
                    ${this.createMorseReference()}
                </div>
            </div>
        `;
        return element;
    }

    createMorseReference() {
        return `
            <div class="reference-table">
                ${Object.entries(this.morseCodeMap).map(([letter, code]) => `
                    <div class="reference-item">
                        <span class="letter">${letter}</span>
                        <span class="code">${code}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    attachEventListeners() {
        const submitBtn = this.element.querySelector('.submit-btn');
        const input = this.element.querySelector('.answer-input');

        submitBtn.addEventListener('click', () => this.validate());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.validate();
        });
    }

    validate() {
        const input = this.element.querySelector('.answer-input');
        if (input.value.toUpperCase().trim() === this.solution.toUpperCase().trim()) {
            this.showSuccess();
        } else {
            this.showError();
        }
    }
}

class DifferenceSpottingPuzzle extends Puzzle {
    constructor(config) {
        super(config);
        this.image1Url = config.image1Url;
        this.image2Url = config.image2Url;
        this.differences = config.differences; // Array of {x, y, radius} coordinates
        this.foundDifferences = new Set();
    }

    createPuzzleElement() {
        const element = document.createElement('div');
        element.className = 'puzzle difference-spotting';
        element.innerHTML = `
            <div class="puzzle-content">
                <h3>Spot the Differences</h3>
                <div class="images-container">
                    <div class="image-wrapper">
                        <img src="${this.image1Url}" alt="Image 1" class="comparison-image" />
                        <div class="click-overlay" data-image="1"></div>
                    </div>
                    <div class="image-wrapper">
                        <img src="${this.image2Url}" alt="Image 2" class="comparison-image" />
                        <div class="click-overlay" data-image="2"></div>
                    </div>
                </div>
                <div class="progress-counter">
                    Found: <span class="differences-found">0</span>/${this.differences.length}
                </div>
            </div>
        `;
        return element;
    }

    attachEventListeners() {
        const overlays = this.element.querySelectorAll('.click-overlay');
        overlays.forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                const rect = overlay.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                this.checkDifference(x, y);
            });
        });
    }

    checkDifference(clickX, clickY) {
        for (let i = 0; i < this.differences.length; i++) {
            const diff = this.differences[i];
            const distance = Math.sqrt(
                Math.pow(clickX - diff.x, 2) + 
                Math.pow(clickY - diff.y, 2)
            );

            if (distance <= diff.radius && !this.foundDifferences.has(i)) {
                this.foundDifferences.add(i);
                this.markDifference(diff);
                this.updateProgress();
                this.validate();
                return;
            }
        }
        this.showError();
    }

    markDifference(diff) {
        const overlays = this.element.querySelectorAll('.click-overlay');
        overlays.forEach(overlay => {
            const marker = document.createElement('div');
            marker.className = 'difference-marker';
            marker.style.left = `${diff.x}%`;
            marker.style.top = `${diff.y}%`;
            overlay.appendChild(marker);
        });
    }

    updateProgress() {
        const counter = this.element.querySelector('.differences-found');
        counter.textContent = this.foundDifferences.size;
    }

    validate() {
        if (this.foundDifferences.size === this.differences.length) {
            this.showSuccess();
        }
    }
}