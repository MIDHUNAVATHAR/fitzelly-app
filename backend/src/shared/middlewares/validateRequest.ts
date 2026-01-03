import { NextFunction, Request, Response } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { HttpStatus, ResponseStatus } from '../../constants/statusCodes.constants.js';

export const validateRequest = (schema: ZodSchema) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        // Optional: Replace req.body with parsed body if stripping is desired
        // if (result.body) req.body = result.body;
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: ResponseStatus.ERROR,
                message: 'Validation failed',
                errors: (error as any).errors.map((e: any) => ({
                    field: e.path.join('.'),
                    message: e.message,
                })),
            });
        }
        next(error);
    }
};
