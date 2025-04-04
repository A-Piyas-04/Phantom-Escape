document.addEventListener('DOMContentLoaded', () => {
    const game = new EscapeGame();
    const room1Data = {
        id: 1,
        name: 'Cyber Security Lab',
        puzzles: [
            {
                id: 'puzzle-1',
                type: 'riddle',
                config: {
                    riddle: 'The more you take, the more you leave behind. What am I?',
                    answer: 'footsteps'
                }
            },
            {
                id: 'puzzle-2',
                type: 'math-logic',
                config: {
                    problem: 'If 3+3 = 12, 4+4 = 20, 5+5 = 30, then what is 6+6?',
                    answer: '42',
                    explanation: 'The pattern follows: n+n = n×(n+1)'
                }
            }
        ]
    };

    let solvedPuzzles = 0;

    function initRoom() {
        game.currentRoom = room1Data;
        game.initTimer();

        // Initialize each puzzle
        room1Data.puzzles.forEach(puzzleData => {
            const puzzleElement = document.getElementById(puzzleData.id);
            if (!puzzleElement) return;

            let puzzle;
            switch (puzzleData.type) {
                case 'riddle':
                    puzzle = new RiddlePuzzle(puzzleData.config);
                    break;
                case 'math-logic':
                    puzzle = new MathLogicPuzzle(puzzleData.config);
                    break;
            }

            if (puzzle) {
                puzzle.onSuccess = () => handlePuzzleSuccess(puzzleData.id);
                puzzle.attachEventListeners();
                game.puzzles.set(puzzleData.id, puzzle);
            }
        });

        // Initialize hint system
        document.querySelectorAll('.puzzle-card').forEach(card => {
            const hintBtn = document.createElement('button');
            hintBtn.className = 'cyber-button hint-btn';
            hintBtn.textContent = 'Get Hint';
            hintBtn.addEventListener('click', () => requestHint(card.id));
            card.querySelector('.puzzle-inner').appendChild(hintBtn);
        });
    }

    function handlePuzzleSuccess(puzzleId) {
        const puzzleCard = document.getElementById(puzzleId);
        puzzleCard.classList.add('solved');
        game.score += 100;
        game.updateUI();
        solvedPuzzles++;

        if (solvedPuzzles === room1Data.puzzles.length) {
            setTimeout(() => {
                alert('Congratulations! You have completed Room 1!');
                window.location.href = '/views/room-2.html';
            }, 1000);
        }
    }

    async function requestHint(puzzleId) {
        const hint = await game.requestHint(puzzleId);
        if (hint) {
            const puzzleCard = document.getElementById(puzzleId);
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = hint;
            puzzleCard.querySelector('.puzzle-inner').appendChild(hintDisplay);
            setTimeout(() => hintDisplay.remove(), 5000);
        }
    }

    initRoom();
});