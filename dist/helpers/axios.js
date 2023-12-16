"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGatewayService = exports.SSLValidationService = exports.SSLPaymentService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const HttpService = (baseUrl) => {
    const instance = axios_1.default.create({
        baseURL: baseUrl,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    instance.interceptors.request.use((config) => {
        return config;
    }, (error) => {
        return error;
    });
    instance.interceptors.response.use((response) => {
        return response.data;
    }, (error) => {
        return Promise.reject(error);
    });
    return instance;
};
const SSLPaymentService = HttpService(config_1.default.ssl.sslPaymentUrl);
exports.SSLPaymentService = SSLPaymentService;
const SSLValidationService = HttpService(config_1.default.ssl.sslValidationUrl);
exports.SSLValidationService = SSLValidationService;
const ApiGatewayService = HttpService(config_1.default.apiGatewayUrl);
exports.ApiGatewayService = ApiGatewayService;
