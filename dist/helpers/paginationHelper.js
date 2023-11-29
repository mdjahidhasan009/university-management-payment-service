"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationHelper = void 0;
const getPaginationOptions = (options = {}) => {
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 10);
    const skip = (page - 1) * limit;
    return {
        page,
        limit,
        skip
    };
};
exports.PaginationHelper = {
    getPaginationOptions
};
