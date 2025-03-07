document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const startButton = document.querySelector('.cyber-button.glow');

    // Initially disable the start button
    startButton.disabled = true;
    startButton.style.opacity = '0.5';
    startButton.style.cursor = 'not-allowed';

    // Add input event listener to username field
    usernameInput.addEventListener('input', () => {
        const isValid = usernameInput.value.trim().length > 0;
        startButton.disabled = !isValid;
        startButton.style.opacity = isValid ? '1' : '0.5';
        startButton.style.cursor = isValid ? 'pointer' : 'not-allowed';
    });

    // Update button click handler
    startButton.onclick = (e) => {
        e.preventDefault();
        if (usernameInput.value.trim().length > 0) {
            window.location.href = '/views/room-1.html';
        }
    };
});