"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const apiError_1 = __importDefault(require("../../errors/apiError"));
const handlePrismaClientKnownRequestError_1 = __importDefault(require("../../errors/handlePrismaClientKnownRequestError"));
const handlePrismaValidationError_1 = __importDefault(require("../../errors/handlePrismaValidationError"));
const handleZodError_1 = __importDefault(require("../../errors/handleZodError"));
const globalExceptionHandler = (error, req, res, next) => {
    console.log('🚀 exceptionHandler ~ error:', error);
    let errorMessages = [];
    let statusCode = 500;
    let message = 'Something went wrong';
    if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        const simplifiedError = (0, handlePrismaValidationError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const simplifiedError = (0, handlePrismaClientKnownRequestError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error instanceof apiError_1.default) {
        statusCode = error === null || error === void 0 ? void 0 : error.statusCode;
        message = error === null || error === void 0 ? void 0 : error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: '',
                    message: error === null || error === void 0 ? void 0 : error.message
                }
            ]
            : [];
    }
    else if (error instanceof Error) {
        message = error === null || error === void 0 ? void 0 : error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: '',
                    message: error === null || error === void 0 ? void 0 : error.message
                }
            ]
            : [];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorMessages
    });
};
exports.default = globalExceptionHandler;
