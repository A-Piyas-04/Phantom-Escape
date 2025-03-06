// Cyberpunk Animation Controls

document.addEventListener('DOMContentLoaded', () => {
    // Initialize page transition effects
    document.body.classList.add('page-transition');

    // Handle glitch text effects
    const glitchTexts = document.querySelectorAll('.glitch-text');
    glitchTexts.forEach(text => {
        text.addEventListener('mouseover', () => {
            text.style.animationDuration = '0.5s';
        });
        text.addEventListener('mouseout', () => {
            text.style.animationDuration = '1s';
        });
    });

    // Handle cyber button hover effects
    const cyberButtons = document.querySelectorAll('.cyber-button');
    cyberButtons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.classList.add('hover-effect');
        });
        button.addEventListener('mouseout', () => {
            button.classList.remove('hover-effect');
        });
    });

    // Add loading spinner when navigating
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (!link.hasAttribute('data-no-spinner')) {
                const spinner = document.createElement('div');
                spinner.className = 'cyber-spinner';
                document.body.appendChild(spinner);
            }
        });
    });

    // Handle success/error animations
    window.showSuccessAnimation = (element) => {
        element.classList.add('success-animation');
        setTimeout(() => {
            element.classList.remove('success-animation');
        }, 500);
    };

    window.showErrorAnimation = (element) => {
        element.classList.add('error-animation');
        setTimeout(() => {
            element.classList.remove('error-animation');
        }, 500);
    };

    // Heartbeat Sound Effect
    class HeartbeatSound {
        constructor() {
            this.audio = new Audio('/assets/sounds/heartbeat.mp3');
            this.audio.loop = true;
            this.basePlaybackRate = 1.0;
        }

        start() {
            this.audio.play();
        }

        stop() {
            this.audio.pause();
            this.audio.currentTime = 0;
        }

        setIntensity(timeLeft, totalTime) {
            const intensity = 1 + (1 - timeLeft / totalTime) * 1.5;
            this.audio.playbackRate = this.basePlaybackRate * intensity;
        }
    }

    // Initialize heartbeat sound
    const heartbeat = new HeartbeatSound();

    // Door unlock animation
    window.showDoorUnlock = (doorElement) => {
        doorElement.classList.add('door', 'unlocked');
    };

    // Flickering light effect
    window.startFlickerEffect = (element) => {
        element.classList.add('flicker-light');
    };

    // Enhanced timer warning with heartbeat
    window.startTimerWarning = (timerElement, warningThreshold) => {
        const timeLeft = parseInt(timerElement.dataset.timeLeft);
        const totalTime = parseInt(timerElement.dataset.totalTime);

        if (timeLeft <= warningThreshold) {
            timerElement.classList.add('timer', 'warning');
            heartbeat.start();
            heartbeat.setIntensity(timeLeft, totalTime);
        }

        if (timeLeft <= 0) {
            heartbeat.stop();
        }
    };

    // Add interactive element effects
    document.querySelectorAll('.interactive-element').forEach(element => {
        element.classList.add('click-feedback');
    });
});