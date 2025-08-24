// Contest status types
const ContestStatus = {
    UPCOMING: 'UPCOMING',
    RUNNING: 'RUNNING', 
    FINISHED: 'FINISHED'
};

// Contest platforms
const ContestPlatform = {
    CODEFORCES: 'Codeforces',
    CODECHEF: 'CodeChef',
    HACKEREARTH: 'HackerEarth',
    LEETCODE: 'LeetCode'
};

// Contest difficulty levels
const ContestDifficulty = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate', 
    ADVANCED: 'Advanced',
    EXPERT: 'Expert'
};

// Main Contest class
class Contest {
    constructor({
        id,
        name,
        platform,
        startTime,
        duration, // in minutes
        status = ContestStatus.UPCOMING,
        difficulty = ContestDifficulty.INTERMEDIATE,
        url = '',
        description = ''
    }) {
        this.id = id;
        this.name = name;
        this.platform = platform;
        
        // Ensure startTime is a proper Date object
        this.startTime = startTime instanceof Date ? startTime : new Date(startTime);
        
        // Validate that the date is reasonable (not in the far past or future)
        const now = new Date();
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        const twoYearsFromNow = new Date(now.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
        
        if (this.startTime < oneYearAgo || this.startTime > twoYearsFromNow) {
            throw new Error(`Invalid contest start time: ${this.startTime}`);
        }
        
        this.duration = duration; // minutes
        this.endTime = new Date(this.startTime.getTime() + duration * 60 * 1000);
        this.status = this.determineStatus();
        this.difficulty = difficulty;
        this.url = url;
        this.description = description;
    }

    // Automatically determine contest status based on current time
    determineStatus() {
        const now = Date.now();
        const startTime = this.startTime.getTime();
        const endTime = this.endTime.getTime();
        
        if (now < startTime) {
            return ContestStatus.UPCOMING;
        } else if (now >= startTime && now <= endTime) {
            return ContestStatus.RUNNING;
        } else {
            return ContestStatus.FINISHED;
        }
    }

    // Get time until contest starts (in minutes)
    getTimeUntilStart() {
        return Math.floor((this.startTime.getTime() - Date.now()) / 60000);
    }

    // Get time until contest ends (in minutes)  
    getTimeUntilEnd() {
        return Math.floor((this.endTime.getTime() - Date.now()) / 60000);
    }

    // Check if contest is currently running
    isRunning() {
        const now = Date.now();
        return now >= this.startTime.getTime() && now <= this.endTime.getTime();
    }

    // Check if contest is truly upcoming (starts in the future)
    isUpcoming() {
        return this.startTime.getTime() > Date.now();
    }

    // Check if contest is finished
    isFinished() {
        return this.endTime.getTime() < Date.now();
    }

    // Format duration in human readable format
    getFormattedDuration() {
        const hours = Math.floor(this.duration / 60);
        const minutes = this.duration % 60;
        
        if (hours === 0) return `${minutes}m`;
        if (minutes === 0) return `${hours}h`;
        return `${hours}h ${minutes}m`;
    }

    // Get relative time string (e.g., "in 2 hours", "2 days ago")
    getRelativeTime() {
        const now = Date.now();
        const contestTime = this.startTime.getTime();
        const diff = contestTime - now;
        
        if (diff < 0) {
            return 'already started';
        }
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (minutes < 60) {
            return `in ${minutes} minutes`;
        } else if (hours < 24) {
            return `in ${hours} hours`;
        } else {
            return `in ${days} days`;
        }
    }

    // Get formatted start time for display
    getFormattedStartTime() {
        return this.startTime.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
    }
}

module.exports = {
    Contest,
    ContestStatus,
    ContestPlatform,
    ContestDifficulty
};
