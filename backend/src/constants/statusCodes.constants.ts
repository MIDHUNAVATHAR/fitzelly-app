/**
 * HTTP Status Code Constants
 * Centralized status codes for consistent API responses
 */

export enum HttpStatus {
    // Success Responses (2xx)
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,

    // Client Error Responses (4xx)
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,

    // Server Error Responses (5xx)
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
}

export enum ResponseStatus {
    SUCCESS = 'success',
    ERROR = 'error',
    FAIL = 'fail'
}
