// Audio Context for ambient sounds
let audioContext;
let ambientSound;
let clickSound;
let doorCreakSound;

// Initialize audio context and load sounds
async function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Load ambient sound
        const ambientResponse = await fetch('assets/sounds/ambient.mp3');
        const ambientBuffer = await ambientResponse.arrayBuffer();
        ambientSound = await audioContext.decodeAudioData(ambientBuffer);
        
        // Load click sound
        const clickResponse = await fetch('assets/sounds/click.mp3');
        const clickBuffer = await clickResponse.arrayBuffer();
        clickSound = await audioContext.decodeAudioData(clickBuffer);

        // Load door creak sound
        const creakResponse = await fetch('assets/sounds/door-creak.mp3');
        const creakBuffer = await creakResponse.arrayBuffer();
        doorCreakSound = await audioContext.decodeAudioData(creakBuffer);
        
        // Start ambient sound
        playAmbientSound();
    } catch (error) {
        console.error('Error initializing audio:', error);
    }
}

// Play ambient sound in loop
function playAmbientSound() {
    const source = audioContext.createBufferSource();
    source.buffer = ambientSound;
    source.loop = true;
    
    // Create gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.3; // Set volume to 30%
    
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start();
}

// Play click sound effect
function playClickSound() {
    const source = audioContext.createBufferSource();
    source.buffer = clickSound;
    source.connect(audioContext.destination);
    source.start();
}

// Play door creak sound effect
function playDoorCreakSound() {
    const source = audioContext.createBufferSource();
    source.buffer = doorCreakSound;
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5; // Set volume to 50%
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start();
}

// Countdown Timer
class CountdownTimer {
    constructor(duration, display) {
        this.duration = duration;
        this.display = display;
        this.running = false;
        this.remainingTime = duration;
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.lastTimestamp = performance.now();
            this.animate();
        }
    }

    stop() {
        this.running = false;
    }

    reset() {
        this.remainingTime = this.duration;
        this.updateDisplay();
    }

    animate(timestamp) {
        if (!this.running) return;

        const elapsed = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        this.remainingTime = Math.max(0, this.remainingTime - elapsed);
        this.updateDisplay();

        if (this.remainingTime > 0) {
            requestAnimationFrame(this.animate.bind(this));
        } else {
            this.stop();
            // Trigger game over or other events
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.remainingTime / 60000);
        const seconds = Math.floor((this.remainingTime % 60000) / 1000);
        const milliseconds = Math.floor((this.remainingTime % 1000) / 10);

        this.display.textContent = 
            `${minutes.toString().padStart(2, '0')}:
             ${seconds.toString().padStart(2, '0')}.
             ${milliseconds.toString().padStart(2, '0')}`;
    }
}

// Initialize interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Initialize audio on user interaction
    document.addEventListener('click', () => {
        if (!audioContext) initAudio();
        playClickSound();
    }, { once: true });

    // Add hover effect sound to all interactive elements
    const interactiveElements = document.querySelectorAll(
        '.cyber-button, .nav-link, .dashboard-card'
    );
    
    interactiveElements.forEach(element => {
        element.addEventListener('click', () => {
            if (audioContext) playClickSound();
        });
    });

    // Add door creak sound to room transitions
    const rooms = document.querySelectorAll('.room');
    rooms.forEach(room => {
        room.addEventListener('transitionstart', () => {
            if (audioContext && room.classList.contains('active')) {
                playDoorCreakSound();
            }
        });
    });

    // Initialize countdown timer if timer element exists
    const timerDisplay = document.querySelector('.countdown-timer');
    if (timerDisplay) {
        const timer = new CountdownTimer(3600000, timerDisplay); // 1 hour
        timer.start();
    }
});