import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpStatus } from '../../constants/statusCodes.constants.js';
import { GymRepositoryImpl } from '../../modules/gym/authentication/infrastructure/repositories/GymRepositoryImpl.js';
import { GymClientRepositoryImpl } from '../../modules/gym/gym-client/infrastructure/repositories/GymClientRepositoryImpl.js';
import { GymTrainerRepositoryImpl } from '../../modules/gym/gym-trainer/infrastructure/repositories/GymTrainerRepositoryImpl.js';
import { SuperAdminRepositoryImpl } from '../../modules/super-admin/infrastructure/repositories/SuperAdminRepositoryImpl.js';
import { ROLES, type Role } from '../../constants/roles.constants.js';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;



const generateAccessToken = (user: any) => {
    const payload = {
        id: user.id || user._id,
        role: user.role,
        email: user.email
    };
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user: any) => {
    const payload = {
        id: user.id || user._id,
        role: user.role
    };
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
};

const checkUserStatus = async (id: string, role: string) => {
    let user = null;
    if (role === ROLES.CLIENT) {
        const clientRepo = new GymClientRepositoryImpl();
        user = await clientRepo.findById(id);
    } else if (role === ROLES.TRAINER) {
        const trainerRepo = new GymTrainerRepositoryImpl();
        user = await trainerRepo.findById(id);
    } else if (role === ROLES.SUPER_ADMIN) {
        const saRepo = new SuperAdminRepositoryImpl();
        user = await saRepo.findById(id);
    } else if (role === ROLES.GYM) {
        const repo = new GymRepositoryImpl();
        user = await repo.findById(id);
    }
    return user;
};

export const protect = (roles: string[] = []) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let accessToken = req.headers.authorization?.split(' ')[1];
            const refreshToken = req.cookies?.refreshToken;


            // 1. Try verifying Access Token
            try {
                if (!accessToken) throw new Error("No access token");

                const decoded = jwt.verify(accessToken, ACCESS_SECRET) as any;

                (req as any).user = decoded;
                // if access token is valid, we never check the db for 15minutes
            }
            catch (err) {
                // 2. If Access Token fails, try Refresh Token
                if (!refreshToken) throw new Error("No refresh token");

                let refreshDecoded: any;
                try {
                    refreshDecoded = jwt.verify(refreshToken, REFRESH_SECRET);
                } catch (verifyErr) {
                    return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid refresh token" });
                }

                // 3. Security Check: Is the user blocked in the DB?
                const user = await checkUserStatus(refreshDecoded.id, refreshDecoded.role);

                if (!user) {
                    return res.status(HttpStatus.FORBIDDEN).json({ message: "Account not found" });
                }

                // Check status if available (e.g. for Client/Trainer)
                if ((user as any).isBlocked || (user as any).isDelete) {
                    return res.status(HttpStatus.FORBIDDEN).json({ message: "Account suspended" });
                }

                // 4. Issue NEW tokens (Rotation)
                // Ensure role is present for token generation
                if (!(user as any).role) (user as any).role = refreshDecoded.role;

                const newAccess = generateAccessToken(user);
                const newRefresh = generateRefreshToken(user);

                // 5. Send back to client
                res.cookie('refreshToken', newRefresh, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production' ? true : false,   //tells, only send this cookie back to the server, if connection is encrypted (https)
                    sameSite: 'strict', // recommended for security
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
                res.setHeader('x-access-token', newAccess);

                (req as any).user = jwt.decode(newAccess);
            }

            // 6. Role Authorization
            if (roles && roles.length > 0) {
                const userRole = (req as any).user.role;
                if (!roles.includes(userRole)) {
                    return res.status(HttpStatus.FORBIDDEN).json({ message: "Unauthorized role" });
                }
            }

            next();
        } catch (error) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Session expired, please login" });
        }
    };
};
