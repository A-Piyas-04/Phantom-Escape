// Puzzle System Base Class and Implementations

class Puzzle {
    constructor(config) {
        this.id = config.id;
        this.type = config.type;
        this.solved = false;
        this.element = null;
        this.onSolve = config.onSolve || (() => {});
    }

    initialize(container) {
        this.element = this.createPuzzleElement();
        container.appendChild(this.element);
        this.attachEventListeners();
    }

    createPuzzleElement() {
        throw new Error('createPuzzleElement must be implemented by puzzle type');
    }

    attachEventListeners() {
        throw new Error('attachEventListeners must be implemented by puzzle type');
    }

    validate() {
        throw new Error('validate must be implemented by puzzle type');
    }

    showSuccess() {
        this.solved = true;
        this.element.classList.add('puzzle-solved');
        window.showSuccessAnimation(this.element);
        this.onSolve();
    }

    showError() {
        window.showErrorAnimation(this.element);
    }
}

class CombinationLockPuzzle extends Puzzle {
    constructor(config) {
        super(config);
        this.combination = config.combination;
        this.hint = config.hint;
    }

    createPuzzleElement() {
        const element = document.createElement('div');
        element.className = 'puzzle combination-lock';
        element.innerHTML = `
            <div class="puzzle-content">
                <h3>Combination Lock</h3>
                <p class="hint">${this.hint}</p>
                <div class="combination-input">
                    <input type="text" maxlength="1" class="digit" />
                    <input type="text" maxlength="1" class="digit" />
                    <input type="text" maxlength="1" class="digit" />
                    <input type="text" maxlength="1" class="digit" />
                </div>
            </div>
        `;
        return element;
    }

    attachEventListeners() {
        const inputs = this.element.querySelectorAll('.digit');
        inputs.forEach((input, index) => {
            input.addEventListener('input', () => {
                if (input.value && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
                this.validate();
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !input.value && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
    }

    validate() {
        const inputs = this.element.querySelectorAll('.digit');
        const attempt = Array.from(inputs).map(input => input.value).join('');
        if (attempt === this.combination) {
            this.showSuccess();
        }
    }
}

class ObjectFindingPuzzle extends Puzzle {
    constructor(config) {
        super(config);
        this.objects = config.objects;
        this.foundObjects = new Set();
    }

    createPuzzleElement() {
        const element = document.createElement('div');
        element.className = 'puzzle object-finding';
        element.innerHTML = `
            <div class="puzzle-content">
                <h3>Find the Objects</h3>
                <div class="objects-list">
                    ${this.objects.map(obj => `
                        <div class="object-item" data-id="${obj.id}">
                            <span class="object-name">${obj.name}</span>
                            <span class="check-mark">✓</span>
                        </div>
                    `).join('')}
                </div>
                <div class="scene-container">
                    ${this.objects.map(obj => `
                        <div class="hidden-object" 
                             data-id="${obj.id}"
                             style="left: ${obj.x}%; top: ${obj.y}%">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        return element;
    }

    attachEventListeners() {
        const hiddenObjects = this.element.querySelectorAll('.hidden-object');
        hiddenObjects.forEach(obj => {
            obj.addEventListener('click', () => {
                const id = obj.dataset.id;
                if (!this.foundObjects.has(id)) {
                    this.foundObjects.add(id);
                    obj.classList.add('found');
                    this.element.querySelector(`.object-item[data-id="${id}"]`)
                        .classList.add('found');
                    this.validate();
                }
            });
        });
    }

    validate() {
        if (this.foundObjects.size === this.objects.length) {
            this.showSuccess();
        }
    }
}

class CipherPuzzle extends Puzzle {
    constructor(config) {
        super(config);
        this.encodedMessage = config.encodedMessage;
        this.solution = config.solution;
        this.type = config.cipherType; // 'caesar' or 'morse'
    }

    createPuzzleElement() {
        const element = document.createElement('div');
        element.className = 'puzzle cipher';
        element.innerHTML = `
            <div class="puzzle-content">
                <h3>Decipher the Message</h3>
                <div class="encoded-message">${this.encodedMessage}</div>
                <div class="cipher-input">
                    <input type="text" class="solution-input" 
                           placeholder="Enter your solution..." />
                    <button class="submit-btn">Check</button>
                </div>
                ${this.type === 'morse' ? this.createMorseHelper() : ''}
            </div>
        `;
        return element;
    }

    createMorseHelper() {
        return `
            <div class="morse-helper">
                <h4>Morse Code Reference</h4>
                <div class="morse-grid">
                    ${Object.entries(this.morseCode).map(([char, code]) => `
                        <div class="morse-item">
                            <span class="char">${char}</span>
                            <span class="code">${code}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const submitBtn = this.element.querySelector('.submit-btn');
        const input = this.element.querySelector('.solution-input');

        submitBtn.addEventListener('click', () => this.validate());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.validate();
        });
    }

    validate() {
        const input = this.element.querySelector('.solution-input');
        if (input.value.toLowerCase() === this.solution.toLowerCase()) {
            this.showSuccess();
        } else {
            this.showError();
        }
    }

    morseCode = {
        'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
        'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
        'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
        's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
        'y': '-.--', 'z': '--..', '1': '.----', '2': '..---', '3': '...--',
        '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
        '9': '----.', '0': '-----'
    };
}

// Export puzzle classes
window.PuzzleSystem = {
    Puzzle,
    CombinationLockPuzzle,
    ObjectFindingPuzzle,
    CipherPuzzle
};