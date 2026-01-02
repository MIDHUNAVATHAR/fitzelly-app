import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();

export class GoogleAuthService {
    private client: OAuth2Client;

    constructor() {
        this.client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI || undefined
        );
    }

    generateAuthUrl(state?: string): string {
        return this.client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
                'openid'
            ],
            ...(state ? { state } : {})
        });
    }

    async verifyToken(tokenOrCode: string): Promise<{ email: string; name: string; googleId: string; picture?: string }> {
        let token = tokenOrCode;

        // If it looks like an authorization code, exchange it for tokens
        if (tokenOrCode.length < 512 && !tokenOrCode.includes('.')) {
            // Crude check, but Authorization codes are usually opaque strings (starting with 4/), ID tokens are JWTs (dots).
            try {
                const { tokens } = await this.client.getToken(tokenOrCode);
                if (tokens.id_token) {
                    token = tokens.id_token;
                } else if (tokens.access_token) {
                    // If no ID token (rare with openid scope), try userinfo with access token
                    const response = await this.client.request<{ email: string; name: string; sub: string; picture?: string }>({
                        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
                        headers: { Authorization: `Bearer ${tokens.access_token}` }
                    });
                    const payload = response.data;
                    return {
                        email: payload.email,
                        name: payload.name || "Google User",
                        googleId: payload.sub,
                        ...(payload.picture ? { picture: payload.picture } : {})
                    };
                }
            } catch (exchangeError) {
                console.error("Code Exchange Failed:", exchangeError);
                throw new Error("Invalid Google Code");
            }
        }

        // Try as ID Token
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID || "",
            });
            const payload = ticket.getPayload();

            if (!payload || !payload.email) {
                throw new Error("Invalid Google Token Payload");
            }

            return {
                email: payload.email,
                name: payload.name || "Google User",
                googleId: payload.sub,
                ...(payload.picture ? { picture: payload.picture } : {})
            };
        } catch (error) {
            // Fallback to calling userinfo if it's a raw access_token (implicit flow fallback)
            try {
                const response = await this.client.request<{ email: string; name: string; sub: string; picture?: string }>({
                    url: 'https://www.googleapis.com/oauth2/v3/userinfo',
                    headers: { Authorization: `Bearer ${token}` }
                });

                const payload = response.data;
                if (!payload || !payload.email) {
                    throw new Error("Invalid Google Access Token Response");
                }

                return {
                    email: payload.email,
                    name: payload.name || "Google User",
                    googleId: payload.sub,
                    ...(payload.picture ? { picture: payload.picture } : {})
                };
            } catch (innerError) {
                console.error("Google Verification Error:", innerError);
                throw new Error('Invalid Google Token');
            }
        }
    }
}
