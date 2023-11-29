"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handlePrismaClientKnownRequestError(error) {
    var _a;
    const statusCode = 400;
    let message = '';
    let errorMessages = [];
    if (error.code === 'P2025') {
        message = ((_a = error.meta) === null || _a === void 0 ? void 0 : _a.cause) || 'RecordNotFound';
        errorMessages = [
            {
                path: '',
                message
            }
        ];
    }
    else if (error.code === 'P2003') {
        if (error.message.includes('delete()` invocation:')) {
            message = 'DeleteFailed';
            errorMessages = [
                {
                    path: '',
                    message
                }
            ];
        }
    }
    else if (error.code === 'P2002') {
        if (error.message.includes('Unique constraint failed on the fields:')) {
            message = 'DuplicateRecord';
            errorMessages = [
                {
                    path: '',
                    message
                }
            ];
        }
    }
    console.error();
    return {
        statusCode,
        message,
        errorMessages
    };
}
exports.default = handlePrismaClientKnownRequestError;
