const { google } = require('googleapis');
const fs = require('fs');
const TOKEN_PATH = './token.json';

class CalendarManager {
    constructor() {
        // Load client secrets from a local file.
        const content = fs.readFileSync('./google-credentials.json');
        const credentials = JSON.parse(content);

        const { client_secret, client_id, redirect_uris } = credentials.web || credentials.installed;
        this.oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]
        );
        this.calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
    }

    // For first-time use, run this to generate a token!
    async getAuthUrl(scopes = ['https://www.googleapis.com/auth/calendar.events']) {
        return this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes
        });
    }

    async setToken(token) {
        this.oAuth2Client.setCredentials(token);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    }

    async loadToken() {
        if (fs.existsSync(TOKEN_PATH)) {
            this.oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
            return true;
        }
        return false;
    }

    // Add an event to Google Calendar
    async addContestToCalendar(contest) {
        const load = await this.loadToken();
        if (!load) throw new Error('Google Calendar not authorized! Run the authentication flow.');
        const event = {
            summary: `[${contest.platform}] ${contest.name}`,
            description: `Duration: ${contest.getFormattedDuration()} \n${contest.url}`,
            start: {
                dateTime: contest.startTime.toISOString(),
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: new Date(contest.startTime.getTime() + contest.duration * 60000).toISOString(),
                timeZone: 'Asia/Kolkata',
            }
        };
        return this.calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });
    }
}

module.exports = CalendarManager;
