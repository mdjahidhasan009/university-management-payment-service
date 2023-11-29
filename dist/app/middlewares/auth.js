"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const apiError_1 = __importDefault(require("../../errors/apiError"));
const jwtHelper_1 = require("../../helpers/jwtHelper");
const redis_1 = require("../../shared/redis");
const auth = (...requiredRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        if (!token) {
            return reject(new apiError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized'));
        }
        const verifiedUser = jwtHelper_1.JwtHelper.verifyToken(token);
        if (!verifiedUser) {
            return reject(new apiError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized'));
        }
        if (config_1.default.env !== 'development') {
            const storedAccessToken = yield redis_1.RedisClient.getAccessToken(verifiedUser.id);
            if (!storedAccessToken) {
                return reject(new apiError_1.default(http_status_1.default.UNAUTHORIZED, 'Use refresh token to get new access token or login again'));
            }
            if (storedAccessToken !== token) {
                return reject(new apiError_1.default(http_status_1.default.UNAUTHORIZED, 'Maybe you are using an old access token'));
            }
        }
        req.user = verifiedUser;
        if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
            return reject(new apiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden'));
        }
        resolve(verifiedUser);
    }))
        .then(() => next())
        .catch((err) => next(err));
});
exports.default = auth;
