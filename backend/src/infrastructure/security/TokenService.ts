import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class TokenService {
    private static readonly SECRET = process.env.JWT_SECRET || 'default_secret_key_change_me';
    private static readonly ACCESS_TOKEN_EXPIRY = '15m';
    private static readonly REFRESH_TOKEN_EXPIRY = '7d';

    static generateAccessToken(payload: object): string {
        return jwt.sign(payload, this.SECRET, { expiresIn: this.ACCESS_TOKEN_EXPIRY });
    }

    static generateRefreshToken(payload: object): string {
        return jwt.sign(payload, this.SECRET, { expiresIn: this.REFRESH_TOKEN_EXPIRY });
    }

    static verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.SECRET);
        } catch (error) {
            return null;
        }
    }
}
