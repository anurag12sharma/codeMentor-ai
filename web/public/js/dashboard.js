// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Auto-refresh stats every 30 seconds
    let autoRefreshInterval;
    
    function startAutoRefresh() {
        autoRefreshInterval = setInterval(refreshStats, 30000);
        console.log('🔄 Auto-refresh enabled (30s intervals)');
    }
    
    function stopAutoRefresh() {
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
            console.log('⏹️ Auto-refresh disabled');
        }
    }
    
    async function refreshStats() {
        try {
            const response = await fetch('/api/stats');
            const data = await response.json();
            
            if (data.success) {
                updateStatsDisplay(data);
                showToast('Stats updated successfully', 'success');
            }
        } catch (error) {
            console.error('Failed to refresh stats:', error);
            showToast('Failed to refresh stats', 'error');
        }
    }
    
    function updateStatsDisplay(data) {
        // Update bot stats if elements exist
        const elements = {
            totalContests: document.querySelector('[data-stat="total"]'),
            upcomingContests: document.querySelector('[data-stat="upcoming"]'),
            runningContests: document.querySelector('[data-stat="running"]'),
            botGuilds: document.querySelector('[data-stat="guilds"]'),
            botUsers: document.querySelector('[data-stat="users"]'),
            botUptime: document.querySelector('[data-stat="uptime"]')
        };
        
        if (elements.totalContests) elements.totalContests.textContent = data.contestStats.total;
        if (elements.upcomingContests) elements.upcomingContests.textContent = data.contestStats.upcoming;
        if (elements.runningContests) elements.runningContests.textContent = data.contestStats.running;
        if (elements.botGuilds) elements.botGuilds.textContent = data.botStats.guilds;
        if (elements.botUsers) elements.botUsers.textContent = data.botStats.users;
        if (elements.botUptime) elements.botUptime.textContent = `${data.botStats.uptime} minutes`;
    }
    
    function showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : 'success'} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi bi-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        // Add to toast container (create if doesn't exist)
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        toastContainer.appendChild(toast);
        
        // Show toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Remove after hiding
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
    
    // Start auto-refresh
    startAutoRefresh();
    
    // Stop auto-refresh when page is not visible
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            startAutoRefresh();
        } else {
            stopAutoRefresh();
        }
    });
    
    // Manual refresh button
    const refreshBtn = document.querySelector('#refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async function() {
            this.disabled = true;
            this.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Refreshing...';
            
            await refreshStats();
            
            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Refresh';
            }, 1000);
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Contest filter functionality (if on contests page)
    const platformFilter = document.querySelector('#platformFilter');
    if (platformFilter) {
        platformFilter.addEventListener('change', function() {
            filterContests(this.value);
        });
    }
    
    function filterContests(platform) {
        const contestCards = document.querySelectorAll('.contest-card');
        
        contestCards.forEach(card => {
            const contestPlatform = card.querySelector('.badge').textContent.trim();
            
            if (platform === 'All' || contestPlatform === platform) {
                card.parentElement.style.display = 'block';
            } else {
                card.parentElement.style.display = 'none';
            }
        });
    }
});

// Utility functions
function formatTimeUntil(timestamp) {
    const now = new Date().getTime();
    const diff = timestamp - now;
    
    if (diff <= 0) return 'Started';
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}
