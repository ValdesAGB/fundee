/**
 * Standard error response structure
 */
export interface ErrorResponse {
    error: string;
    message: string;
    details?: unknown;
}

/**
 * Standard success response structure
 */
export interface SuccessResponse<T = unknown> {
    success: true;
    data: T;
    message?: string;
}

/**
 * Create a standardized error response
 */
export function errorResponse(
    error: string,
    message: string,
    status: number = 400,
    details?: unknown
): Response {
    const body: ErrorResponse = { error, message };
    if (details) {
        body.details = details;
    }

    return Response.json(body, { status });
}

/**
 * Create a standardized success response
 */
export function successResponse<T>(
    data: T,
    message?: string,
    status: number = 200
): Response {
    const body: SuccessResponse<T> = { success: true, data };
    if (message) {
        body.message = message;
    }

    return Response.json(body, { status });
}

/**
 * Common error responses
 */
export const Errors = {
    unauthorized: () => errorResponse('Unauthorized', 'Authentication required', 401),

    forbidden: () => errorResponse('Forbidden', 'Insufficient permissions', 403),

    notFound: (resource: string = 'Resource') =>
        errorResponse('Not Found', `${resource} not found`, 404),

    badRequest: (message: string) =>
        errorResponse('Bad Request', message, 400),

    validationError: (message: string) =>
        errorResponse('Validation Error', message, 400),

    conflict: (message: string) =>
        errorResponse('Conflict', message, 409),

    internalError: (message: string = 'An unexpected error occurred') =>
        errorResponse('Internal Server Error', message, 500),
};

/**
 * Handle async route errors
 */
export function handleRouteError(error: unknown): Response {
    // Always log the full error server-side
    console.error('Route error:', error);

    // Never expose internal error details to the client
    return Errors.internalError();
}
