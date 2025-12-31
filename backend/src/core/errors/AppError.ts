import { HttpStatus } from "../../constants/statusCodes.constants.js";

export class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number = HttpStatus.BAD_REQUEST) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = "Unauthorized") {
        super(message, HttpStatus.UNAUTHORIZED)
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = "Access denied") {
        super(message, HttpStatus.FORBIDDEN);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} not found`, HttpStatus.NOT_FOUND);
    }
}


