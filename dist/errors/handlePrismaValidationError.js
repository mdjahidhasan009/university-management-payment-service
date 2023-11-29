"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handlePrismaValidationError(error) {
    const statusCode = 400;
    const message = 'ValidationError';
    const errorMessages = [
        {
            path: '',
            message: error.message
        }
    ];
    return {
        statusCode,
        message,
        errorMessages
    };
}
exports.default = handlePrismaValidationError;
