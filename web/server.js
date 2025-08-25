const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const ContestManager = require('../utils/contestManager');
const AIService = require('../utils/aiService');

const app = express();
const port = process.env.PORT || 3000;

// Security and middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initialize services
const contestManager = new ContestManager();
let botClient = null; // Will be set when bot starts

// Set bot client reference
const setBotClient = (client) => {
    botClient = client;
};

// Routes
app.get('/', async (req, res) => {
    try {
        const contests = await contestManager.getUpcomingContests(50);
        const stats = await contestManager.getContestStats();
        const runningContests = await contestManager.getRunningContests();
        
        const botStats = botClient ? {
            guilds: botClient.guilds.cache.size,
            users: botClient.users.cache.size,
            uptime: Math.floor(botClient.uptime / 1000 / 60), // minutes
            status: 'online'
        } : {
            guilds: 0,
            users: 0,
            uptime: 0,
            status: 'offline'
        };

        res.render('index', {
            title: 'CodeMentor AI Dashboard',
            contests,
            stats,
            runningContests,
            botStats
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.render('error', { error: 'Failed to load dashboard data' });
    }
});

app.get('/api/contests', async (req, res) => {
    try {
        const contests = await contestManager.getUpcomingContests(20);
        res.json({ success: true, contests });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/stats', async (req, res) => {
    try {
        const stats = await contestManager.getContestStats();
        const botStats = botClient ? {
            guilds: botClient.guilds.cache.size,
            users: botClient.users.cache.size,
            uptime: Math.floor(botClient.uptime / 1000 / 60),
            status: 'online'
        } : { guilds: 0, users: 0, uptime: 0, status: 'offline' };

        res.json({ success: true, contestStats: stats, botStats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/contests', async (req, res) => {
    try {
        const contests = await contestManager.getUpcomingContests(50);
        const platforms = ['All', ...Object.values(require('../utils/contestTypes').ContestPlatform)];
        
        res.render('contests', {
            title: 'All Contests - CodeMentor AI',
            contests,
            platforms
        });
    } catch (error) {
        res.render('error', { error: 'Failed to load contests' });
    }
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About CodeMentor AI'
    });
});

// Error handling
app.use((req, res) => {
    res.status(404).render('error', { 
        error: 'Page not found',
        title: 'Error - CodeMentor AI'
    });
});

app.use((error, req, res, next) => {
    console.error('Web server error:', error);
    res.status(500).render('error', { 
        error: 'Internal server error',
        title: 'Error - CodeMentor AI'
    });
});

// Start server
const server = app.listen(port, () => {
    console.log(`🌐 Web dashboard running at http://localhost:${port}`);
});

module.exports = { app, setBotClient };