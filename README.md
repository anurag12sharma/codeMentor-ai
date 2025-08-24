# 🤖 CodeMentorAI - The Ultimate Competitive Programming Assistant

<div align="center">

![CodeMentor AI Banner](https://img.shields.io/badge/CodeMentor%20AI-Competitive%20Programming%20Bot-blue?style=for-the-badge&logo=discord)

[![Live Bot](https://img.shields.io/badge/🤖%20Live%20Bot-Online-success?style=for-the-badge)](https://your-railway-url.railway.app)
[![Web Dashboard](https://img.shields.io/badge/🌐%20Dashboard-Live-blue?style=for-the-badge)](https://codementor-ai-dashboard-anurag12sharmas-projects.vercel.app)
[![Invite the Bot](https://img.shields.io/badge/💬%20Invite%20to%20Discord%20Server-5865F2.svg?style=for-the-badge&logo=discord)](https://discord.com/oauth2/authorize?client_id=1408136900438528000&scope=bot+applications.commands&permissions=268954752)
[![Hackathon](https://img.shields.io/badge/🏆%20Global%20MCP-Hackathon%202025-gold?style=for-the-badge)](https://hackathon.example.com)

**AI-powered Discord bot to supercharge your competitive programming journey: stay up-to-date with contests, get personalized study recommendations, and never miss a coding challenge!**

</div>

---

## ✨ Features

### 🏆 Real-Time Contest Tracking
- **Multi-Platform:** Codeforces, CodeChef, HackerEarth, LeetCode
- **Live Updates:** Auto-refresh with the latest contests and stats
- **Contest Search:** Filter by platform, keyword, or difficulty
- **Running Contests:** Track currently active competitions

### 🧠 AI-Powered Recommendations
- **Personalized Study Plans:** AI-suggested study paths
- **Smart Contest Suggestions:** Tailored for your skill level
- **Programming Tips:** Instant context-aware advice

### 🔔 Smart Reminders
- **Never Miss a Contest:** Automated notifications before start
- **Customizable Alerts:** Enable/disable reminders with simple commands

### 🌐 Modern Web Dashboard
- **Live Stats:** See upcoming & running contests in real time
- **Beautiful UI:** Built with EJS, Bootstrap, fully responsive
- **Bot Analytics:** Live metrics for users, servers, uptime

### 🔐 Secure by Design
- **Descope Outbound Apps:** Secure authentication for all API calls
- **API Protection:** Rate limiting and robust error handling

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Bot Framework:** Discord.js
- **AI/ML:** Google Gemini API (LLM)
- **Authentication:** Descope Node SDK
- **Dashboard:** Express, EJS, Bootstrap, Vercel hosting
- **Integrations:** CompeteAPI, Google Calendar API
- **Deployment:** Railway (bot), Vercel (dashboard)
- **Monitoring:** UptimeRobot

---

## 🚀 Quick Start

```
# 1. Clone the repository
git clone https://github.com/your-username/codementor-ai.git
cd codementor-ai

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and fill in your Discord token, AI API key, etc.

# 4. Start the bot
npm start

# 5. Start the web dashboard (optional)
cd web
npm install
node server.js
```

---

## 💬 Commands & Usage

```
# Contest Commands
!contests          # Upcoming contests
!contests cf       # Codeforces only
!running           # Running/ongoing contests
!search string     # Search contests

# AI Commands
!schedule beginner      # Get a study plan
!tip "data structures"  # Get AI programming tip

# Settings Commands
!remind-on          # Enable reminders
!remind-off         # Disable reminders
!help               # Full command list
```

---

## 🏗️ Architecture

```
graph LR
    DiscordUser -->|Commands| DiscordBot
    DiscordBot -->|Fetch| ContestAPIs
    DiscordBot -->|AI Requests| GoogleGemini
    DiscordBot -->|Auth| Descope
    DiscordBot -->|Analytics| WebDashboard
    WebDashboard -->|API| ContestAPIs
    DiscordBot -.->|Reminders| DiscordUser
```

---

## 🌐 Live Links

| Service         | URL                                                                                                    | Status      |
|-----------------|-------------------------------------------------------------------------------------------------------|-------------|
| Discord Bot     | [Railway App](https://your-railway-url.railway.app)                                                   | 🟢 Online   |
| Web Dashboard   | [Vercel Web](https://codementor-ai-dashboard.vercel.app/) | 🟢 Online   |
| Invite the Bot  | [Invite Link](https://discord.com/oauth2/authorize?client_id=1408136900438528000&scope=bot+applications.commands&permissions=268954752)        | 🔗          |

---

## 📸 Screenshots

<details>
<summary>Click to expand</summary>

![Bot Command Example](https://via.placeholder.com/900x300/5865F2/ffffff?text=Example+Discord+Bot+Commands)
![Web Dashboard Example](https://via.placeholder.com/900x300/000000/ffffff?text=Web+Dashboard+Live)
</details>

---

## ⚡ Monitoring & Security

- **Descope Outbound Apps:** All external API usage is securely authenticated and monitored.
- **Health Check:** `/health` endpoint for deployment monitoring.
- **UptimeRobot:** 24/7 monitoring.

---

## 👥 About

Built with ❤️ by Anurag Sharma for the **Global MCP Hackathon 2025**.

**Contact:**  
- [Email](mailto:anurag2002sharma@gmail.com)  
- [LinkedIn](https://www.linkedin.com/in/anurag12sharma/)

---

## 📄 License

MIT License

---

## 🙏 Acknowledgments

- Discord.js
- Google Gemini AI
- Descope
- CompeteAPI
- Railway, Vercel
- All hackathon judges and contributors!

---

**⭐ Star this repo if you found it helpful! [https://github.com/anurag12sharma/codeMentor-ai]**

---

