// Game Core Mechanics
class EscapeGame {
    constructor() {
        this.currentRoom = null;
        this.score = 0;
        this.hintsRemaining = 3;
        this.puzzles = new Map();
        this.timer = null;
        this.ROOM_TIME_LIMIT = 480000; // 8 minutes in milliseconds
    }

    async initRoom(roomId) {
        try {
            const response = await fetch(`/api/rooms/${roomId}`);
            const roomData = await response.json();
            
            this.currentRoom = roomData;
            this.initTimer();
            await this.initPuzzles();
            this.updateUI();
        } catch (error) {
            console.error('Error initializing room:', error);
        }
    }

    initTimer() {
        const timerDisplay = document.querySelector('.countdown-timer');
        if (timerDisplay) {
            this.timer = new CountdownTimer(this.ROOM_TIME_LIMIT, timerDisplay);
            this.timer.start();
            
            // Add warning class when time is running low (last 60 seconds)
            setInterval(() => {
                if (this.timer.remainingTime <= 60000) {
                    timerDisplay.classList.add('timer-warning');
                }
            }, 1000);
        }
    }

    async initPuzzles() {
        const gameContent = document.querySelector('.game-content');
        if (!gameContent || !this.currentRoom.puzzles) return;

        // Clear existing puzzles
        gameContent.innerHTML = '';

        // Create and initialize each puzzle
        for (const puzzleData of this.currentRoom.puzzles) {
            let puzzle;
            switch (puzzleData.type) {
                case 'riddle':
                    puzzle = new RiddlePuzzle(puzzleData);
                    break;
                case 'cipher':
                    puzzle = new CipherPuzzle(puzzleData);
                    break;
                case 'math-logic':
                    puzzle = new MathLogicPuzzle(puzzleData);
                    break;
                default:
                    console.warn(`Unknown puzzle type: ${puzzleData.type}`);
                    continue;
            }

            // Add puzzle to the map and render it
            this.puzzles.set(puzzleData.id, puzzle);
            const puzzleElement = puzzle.createPuzzleElement();
            gameContent.appendChild(puzzleElement);
            puzzle.attachEventListeners();
        }
    }

    async requestHint(puzzleId) {
        if (this.hintsRemaining <= 0) {
            this.showMessage('No hints remaining!', 'error');
            return;
        }

        try {
            const response = await fetch(`/api/puzzles/${puzzleId}/hint`);
            const hintData = await response.json();
            
            this.hintsRemaining--;
            this.updateUI();
            
            return hintData.hint;
        } catch (error) {
            console.error('Error requesting hint:', error);
            this.showMessage('Failed to get hint', 'error');
        }
    }

    updateUI() {
        // Update score display
        const scoreDisplay = document.querySelector('.score-display');
        if (scoreDisplay) {
            scoreDisplay.textContent = `Score: ${this.score}`;
        }

        // Update hints display
        const hintsDisplay = document.querySelector('.hints-remaining');
        if (hintsDisplay) {
            hintsDisplay.textContent = `Hints: ${this.hintsRemaining}`;
        }
    }

    showMessage(message, type = 'info') {
        const messageContainer = document.createElement('div');
        messageContainer.className = `message ${type}`;
        messageContainer.textContent = message;

        document.body.appendChild(messageContainer);
        setTimeout(() => messageContainer.remove(), 3000);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new EscapeGame();
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');

    if (roomId) {
        game.initRoom(roomId);
    }
});