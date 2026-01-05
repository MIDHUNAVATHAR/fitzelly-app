import { TokenService } from "../../infrastructure/services/TokenService.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

interface RefreshTokenResponse {
    accessToken: string;
}

export class RefreshTokenUseCase {
    async execute(refreshToken: string): Promise<RefreshTokenResponse> {
        if (!refreshToken) {
            throw new AppError("Refresh token is required", HttpStatus.UNAUTHORIZED);
        }

        const decoded = TokenService.verifyToken(refreshToken);
        if (!decoded) {
            throw new AppError("Invalid or expired refresh token", HttpStatus.UNAUTHORIZED);
        }

        // Generate new access token
        const accessToken = TokenService.generateAccessToken({
            id: decoded.id,
            role: decoded.role
        });

        return { accessToken };
    }
}
