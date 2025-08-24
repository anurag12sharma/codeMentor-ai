# CodeMentor AI - Setup Guide

## Prerequisites

- Node.js 18+ installed
- Discord Bot Token
- Google AI API Key
- Google Cloud Project (for Calendar integration)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/codementor-ai
   cd codementor-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create `.env` file:
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   GOOGLE_AI_API_KEY=your_google_ai_key
   DESCOPE_PROJECT_ID=your_descope_project_id
   ```

4. **Google Calendar Setup (Optional):**
   - Download `google-credentials.json` from Google Cloud Console
   - Place in project root
   - Run `!calendar-auth` in Discord for first-time setup

## Running the Bot

### Development
```bash
npm start
```

### With Web Dashboard
```bash
# Terminal 1 - Bot
npm start

# Terminal 2 - Web Server
cd web
node server.js
```

## Commands

### Contest Commands
- `!contests` - View upcoming contests
- `!contests cf` - Filter by Codeforces
- `!contests cc` - Filter by CodeChef
- `!contests he` - Filter by HackerEarth
- `!contests lc` - Filter by LeetCode
- `!running` - Currently running contests
- `!search <query>` - Search contests

### AI Commands
- `!schedule [level]` - AI study plan
- `!tip <topic>` - Programming tips
- `!recommend [level]` - Contest recommendations

### Utility Commands
- `!health` - System health check
- `!help` - Command list
- `!remind-on/off` - Toggle reminders

### Calendar Commands
- `!calendar-auth` - Setup calendar
- `!addcal <contest>` - Add to calendar

## Troubleshooting

### Bot Not Responding
1. Check Discord token in `.env`
2. Verify bot permissions in Discord server
3. Check console for error messages

### AI Commands Failing
1. Verify `GOOGLE_AI_API_KEY` in `.env`
2. Check API quota in Google Cloud Console
3. Run `!ai-test` to verify connection

### Contest Data Empty
1. Check internet connection
2. APIs may be temporarily down
3. Run `!health` to check service status

### Calendar Integration Issues
1. Verify Google Cloud project setup
2. Check `google-credentials.json` file
3. Ensure Calendar API is enabled
4. Add email as test user in OAuth consent

## Deployment

### Railway
1. Connect GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy automatically

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Configure environment variables

## Support

For issues or questions:
1. Check console logs for detailed errors
2. Run `!health` command for system status
3. Verify all API keys and permissions
```