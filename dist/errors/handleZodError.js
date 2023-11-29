"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleZodError(error) {
    const statusCode = 400;
    const message = 'Validation Error';
    const errorMessages = error.issues.map((issue) => {
        return {
            path: issue.path[issue.path.length - 1],
            message: issue.message
        };
    });
    return {
        statusCode,
        message,
        errorMessages
    };
}
exports.default = handleZodError;
