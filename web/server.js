const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const ContestManager = require('./utils/contestManager'); // ← Changed from ../utils/

const app = express();
const port = process.env.PORT || 3000;

// Security and middleware
app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initialize services
const contestManager = new ContestManager();

// Mock bot stats (since bot isn't connected to web dashboard in Vercel)
const getBotStats = () => ({
    guilds: process.env.NODE_ENV === 'production' ? 8 : 5,
    users: process.env.NODE_ENV === 'production' ? 22 : 13,
    uptime: Math.floor(process.uptime()),
    status: 'online'
});

// Routes
app.get('/', async (req, res) => {
    try {
        const contests = await contestManager.getUpcomingContests(8);
        const stats = await contestManager.getContestStats();
        const runningContests = await contestManager.getRunningContests();
        const botStats = getBotStats();

        res.render('index', {
            title: 'CodeMentor AI Dashboard',
            contests,
            stats,
            runningContests,
            botStats
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.render('error', { 
            error: 'Failed to load dashboard data',
            title: 'Error - CodeMentor AI'
        });
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
        const botStats = getBotStats();

        res.json({ success: true, contestStats: stats, botStats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/contests', async (req, res) => {
    try {
        const contests = await contestManager.getUpcomingContests(50);
        const platforms = ['All', ...Object.values(require('./utils/contestTypes').ContestPlatform)];
        
        res.render('contests', {
            title: 'All Contests - CodeMentor AI',
            contests,
            platforms
        });
    } catch (error) {
        console.error('Contests page error:', error);
        res.render('error', { 
            error: 'Failed to load contests',
            title: 'Error - CodeMentor AI'
        });
    }
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About CodeMentor AI'
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        features: {
            liveContestData: true,
            realTimeUpdates: true,
            multiPlatformSupport: true
        }
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

// Export for Vercel
module.exports = app;

// Start server locally
if (require.main === module) {
    app.listen(port, () => {
        console.log(`🌐 Web dashboard running at http://localhost:${port}`);
    });
}
