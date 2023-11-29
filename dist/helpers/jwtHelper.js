"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtHelper = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("../config"));
const verifyToken = (token) => {
    try {
        const isVerified = (0, jsonwebtoken_1.verify)(token, config_1.default.jwt.secret);
        return isVerified;
    }
    catch (error) {
        return null;
    }
};
exports.JwtHelper = {
    verifyToken
};
