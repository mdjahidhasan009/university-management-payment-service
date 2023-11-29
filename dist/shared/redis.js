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
exports.RedisClient = void 0;
const redis_1 = require("redis");
// import logger from './logger';
const config_1 = __importDefault(require("../config"));
const redisClient = (0, redis_1.createClient)({
    url: config_1.default.redis.url
});
// redisClient.on('error', (err) => logger.error('RedisError', err));
redisClient.on('error', (err) => console.error('RedisError', err));
// redisClient.on('connect', (err) => logger.info('Redis connected'));
redisClient.on('connect', (err) => console.info('Redis connected'));
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.connect();
});
const set = (key, val, options) => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.set(key, val, options);
});
const get = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return yield redisClient.get(key);
});
const del = (key) => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.del(key);
});
const disconnect = () => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.quit();
});
const getAccessToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `access-token:${userId}`;
    return yield redisClient.get(key);
});
const delAccessToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `access-token:${userId}`;
    yield redisClient.del(key);
});
exports.RedisClient = {
    connect,
    set,
    get,
    del,
    disconnect,
    getAccessToken,
    delAccessToken,
    publish: redisClient.publish.bind(redisClient),
    subscribe: redisClient.subscribe.bind(redisClient),
    unsubscribe: redisClient.unsubscribe.bind(redisClient)
};
