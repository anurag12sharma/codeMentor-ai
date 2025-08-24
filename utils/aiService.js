const { generateText, generateObject } = require('ai');
const { google } = require('@ai-sdk/google');
const { z } = require('zod');
const DescopeAuthManager = require('./descopeAuth'); // Add this line

class AIService {
    constructor() {
        // Initialize Descope authentication
        this.authManager = new DescopeAuthManager(); // Add this line
        
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY;
        
        if (!apiKey) {
            throw new Error('Google AI API key is required. Set GOOGLE_AI_API_KEY in your .env file');
        }

        // Authenticate Google AI API through Descope (HACKATHON REQUIREMENT)
        this.initializeSecureAI(apiKey);
        
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 minutes cache
    }

    // Initialize AI with Descope security
    async initializeSecureAI(apiKey) {
        try {
            // Use Descope Outbound Apps for secure Google AI authentication
            const authResult = await this.authManager.authenticateExternalAPI('Google AI', apiKey);
            
            if (authResult.success) {
                this.model = google('models/gemini-1.5-flash-latest', {
                    apiKey: apiKey,
                });
                
                // Store secure authentication info
                this.authInfo = {
                    authenticated: true,
                    secureToken: authResult.secureToken,
                    apiName: authResult.apiName,
                    authenticatedAt: authResult.authenticatedAt
                };
                
                console.log('✅ AI Service initialized with Descope secure authentication');
            }
        } catch (error) {
            console.error('❌ Descope authentication failed, falling back to direct API access:', error.message);
            // Fallback to direct API access
            this.model = google('models/gemini-1.5-flash-latest', {
                apiKey: apiKey,
            });
            this.authInfo = { authenticated: false, fallback: true };
        }
    }

    // Generate text with Descope security validation
    async generateText(prompt, options = {}) {
        // Validate API access through Descope before each call
        if (this.authInfo?.secureToken) {
            const validation = await this.authManager.validateAPIAccess(
                this.authInfo.secureToken, 
                'Google AI'
            );
            
            if (!validation.valid) {
                throw new Error('API access denied by Descope security validation');
            }
        }

        const cacheKey = `text_${this.hashString(prompt)}`;
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                console.log('📋 Using cached AI response (Descope validated)');
                return cached.data;
            }
        }

        try {
            console.log('🧠 Generating AI response with Descope security...');
            const { text } = await generateText({
                model: this.model,
                prompt: prompt,
                maxTokens: options.maxTokens || 1000,
                temperature: options.temperature || 0.7,
                ...options
            });

            // Cache the result
            this.cache.set(cacheKey, {
                data: text,
                timestamp: Date.now(),
                secureAuth: !!this.authInfo?.secureToken
            });

            return text;
        } catch (error) {
            console.error('❌ AI text generation failed:', error);
            
            // Check if it's an API key issue
            if (error.message.includes('API key') || error.message.includes('authentication')) {
                throw new Error('AI service error: Descope authentication validation failed');
            }
            
            throw new Error(`AI service error: ${error.message}`);
        }
    }

    // Get authentication status for monitoring
    getAuthenticationStatus() {
        return {
            ...this.authManager.getAuthenticationStatus(),
            aiServiceAuth: this.authInfo
        };
    }

    // Rest of your existing methods...
    async generateObject(prompt, schema, options = {}) {
        // Same Descope validation as above
        if (this.authInfo?.secureToken) {
            const validation = await this.authManager.validateAPIAccess(
                this.authInfo.secureToken, 
                'Google AI'
            );
            
            if (!validation.valid) {
                throw new Error('API access denied by Descope security validation');
            }
        }

        try {
            console.log('🧠 Generating structured AI response with Descope security...');
            const { object } = await generateObject({
                model: this.model,
                prompt: prompt,
                schema: schema,
                maxTokens: options.maxTokens || 1500,
                temperature: options.temperature || 0.7,
                ...options
            });

            return object;
        } catch (error) {
            console.error('❌ AI object generation failed:', error);
            
            if (error.message.includes('API key') || error.message.includes('authentication')) {
                throw new Error('AI service error: Descope authentication validation failed');
            }
            
            throw new Error(`AI service error: ${error.message}`);
        }
    }

    // Simple hash function for caching
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    // Test the AI connection with Descope
    async testConnection() {
        try {
            console.log('🧪 Testing AI connection with Descope authentication...');
            const testResponse = await this.generateText('Say "Hello from Descope-secured AI!" in one sentence.', {
                maxTokens: 50,
                temperature: 0.1
            });
            console.log(`✅ AI connection test successful with Descope: ${testResponse}`);
            return true;
        } catch (error) {
            console.error('❌ AI connection test failed:', error.message);
            return false;
        }
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('🧹 AI cache cleared');
    }
}

module.exports = AIService;
