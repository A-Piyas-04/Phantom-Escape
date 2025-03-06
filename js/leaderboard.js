// Leaderboard functionality
class Leaderboard {
    constructor() {
        this.container = document.querySelector('.leaderboard-container');
        this.currentView = 'global';
        this.updateInterval = null;
        this.pageSize = 10;
        this.currentPage = 1;
        this.loading = false;
        this.cache = new Map();
        this.cacheTimeout = 10000; // 10 seconds cache
        this.init();
    }

    async init() {
        this.addEventListeners();
        await this.loadLeaderboard();
        // Start auto-refresh every 30 seconds
        this.updateInterval = setInterval(() => this.loadLeaderboard(), 30000);
    }

    addEventListeners() {
        const toggleButtons = document.querySelectorAll('.leaderboard-toggle');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const view = button.dataset.view;
                this.switchView(view);
            });
        });
    }

    async switchView(view) {
        this.currentView = view;
        await this.loadLeaderboard();
    }

    async loadLeaderboard() {
        if (this.loading) return;

        try {
            this.setLoadingState(true);
            const endpoint = this.currentView === 'global' 
                ? '/api/leaderboard/global'
                : `/api/leaderboard/room/${this.currentView}`;

            // Check cache first
            const cacheKey = `${endpoint}_${this.currentPage}`;
            const cachedData = this.cache.get(cacheKey);
            if (cachedData && Date.now() - cachedData.timestamp < this.cacheTimeout) {
                this.renderLeaderboard(cachedData.data);
                return;
            }

            const response = await fetch(`${endpoint}?page=${this.currentPage}&pageSize=${this.pageSize}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            // Cache the response
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            this.renderLeaderboard(data);
        } catch (error) {
            this.showError('Failed to load leaderboard. Please try again later.');
            console.error('Error loading leaderboard:', error);
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(loading) {
        this.loading = loading;
        this.container.classList.toggle('loading', loading);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'leaderboard-error';
        errorDiv.textContent = message;
        this.container.innerHTML = '';
        this.container.appendChild(errorDiv);
    }

    renderLeaderboard(data) {
        if (!this.container) return;

        // Clear any existing error messages
        const existingError = this.container.querySelector('.leaderboard-error');
        if (existingError) existingError.remove();

        const table = document.createElement('table');
        table.className = 'leaderboard-table';

        // Create table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
                <th>Time</th>
                <th>Hints</th>
            </tr>
        `;
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement('tbody');
        data.forEach((player, index) => {
            const row = document.createElement('tr');
            row.className = 'leaderboard-row';
            row.innerHTML = `
                <td class="rank">${index + 1}</td>
                <td class="player neon-text">${player.username}</td>
                <td class="score">${player.totalScore || player.score}</td>
                <td class="time">${this.formatTime(player.averageTime || player.completionTime)}</td>
                <td class="hints">${player.totalHints || player.hintsUsed || 0}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        // Clear and update container
        this.container.innerHTML = '';
        this.container.appendChild(table);

        // Add animation classes
        setTimeout(() => {
            const rows = tbody.querySelectorAll('tr');
            rows.forEach((row, index) => {
                setTimeout(() => {
                    row.classList.add('page-transition');
                }, index * 100);
            });
        }, 0);
    }

    formatTime(seconds) {
        if (!seconds) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// Initialize leaderboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Leaderboard();
});