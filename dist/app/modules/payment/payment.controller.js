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
exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
const response_1 = __importDefault(require("../../../shared/response"));
const http_status_1 = __importDefault(require("http-status"));
const payment_constants_1 = require("./payment.constants");
const pick_1 = __importDefault(require("../../../shared/pick"));
const initPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentService.initPayment(req.body);
    if (!result) {
        (0, response_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.BAD_REQUEST,
            message: 'Payment init failed!',
            data: result
        });
    }
    else {
        (0, response_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: 'Payment init successful!',
            data: result
        });
    }
});
const webhook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('webhook called');
    console.log('req.query', req.query);
    console.log('req.body', req.body);
    const result = yield payment_service_1.PaymentService.webhook(req.query, req.body);
    (0, response_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Payment verified!',
        data: result
    });
    // res.send(result);
});
const getAllFromDB = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, payment_constants_1.paymentFilterableFields);
        const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
        const result = yield payment_service_1.PaymentService.getAllFromDB(filters, options);
        (0, response_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Payments fetched successfully',
            meta: result.meta,
            data: result.data
        });
    }
    catch (error) {
        next(error);
    }
});
const getByIdFromDB = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield payment_service_1.PaymentService.getByIdFromDB(id);
        (0, response_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Payment fetched successfully',
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const paymentSuccessResponse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield payment_service_1.PaymentService.paymentSuccessResponse(req, res);
        (0, response_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Payment success',
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
exports.PaymentController = {
    initPayment,
    webhook,
    getAllFromDB,
    getByIdFromDB,
    paymentSuccessResponse
};
