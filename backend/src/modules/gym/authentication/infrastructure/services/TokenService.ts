import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class TokenService {
    private static readonly ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
    private static readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
    private static readonly ACCESS_TOKEN_EXPIRY = '15m';
    private static readonly REFRESH_TOKEN_EXPIRY = '7d';

    static generateAccessToken(payload: object): string {
        return jwt.sign(payload, this.ACCESS_SECRET, { expiresIn: this.ACCESS_TOKEN_EXPIRY });
    }

    static generateRefreshToken(payload: object): string {
        return jwt.sign(payload, this.REFRESH_SECRET, { expiresIn: this.REFRESH_TOKEN_EXPIRY });
    }

    static verifyToken(token: string, type: 'access' | 'refresh' = 'access'): any {
        try {
            const secret = type === 'access' ? this.ACCESS_SECRET : this.REFRESH_SECRET;
            return jwt.verify(token, secret);
        } catch (error) {
            return null;
        }
    }
}
