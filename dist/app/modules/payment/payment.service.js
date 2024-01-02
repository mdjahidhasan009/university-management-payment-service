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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const ssl_service_1 = require("../ssl/ssl.service");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const payment_constants_1 = require("./payment.constants");
const axios_1 = require("../../../helpers/axios");
const config_1 = __importDefault(require("../../../config"));
const initPayment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // "amount": 100,
        //   "transactionId": "", // use unique tran_id for each api call
        //   "studentName": "",
        //   "studentEmail": "",
        //   "address": "",
        //   "phone": ""
        const paymentSession = yield ssl_service_1.sslService.initPayment({
            total_amount: data === null || data === void 0 ? void 0 : data.amount,
            tran_id: data === null || data === void 0 ? void 0 : data.transactionId,
            cus_name: data === null || data === void 0 ? void 0 : data.studentName,
            cus_email: data === null || data === void 0 ? void 0 : data.studentEmail,
            cus_add1: data === null || data === void 0 ? void 0 : data.address,
            // cus_add2: 'Dhaka',
            // cus_city: 'Dhaka',
            // cus_state: 'Dhaka',
            // cus_postcode: '1000',
            // cus_country: 'Bangladesh',
            cus_phone: data === null || data === void 0 ? void 0 : data.phone
        });
        yield prisma_1.default.payment.create({
            data: {
                amount: data === null || data === void 0 ? void 0 : data.amount,
                transactionId: data === null || data === void 0 ? void 0 : data.transactionId,
                studentId: data === null || data === void 0 ? void 0 : data.studentId
            }
        });
        // console.log(paymentSession?.redirectGatewayURL);
        // const redirectURL = paymentSession?.redirectGatewayURL;
        return (_a = paymentSession === null || paymentSession === void 0 ? void 0 : paymentSession.data) === null || _a === void 0 ? void 0 : _a.redirectGatewayURL;
    }
    catch (e) {
        console.log(e);
        return null;
    }
});
const webhook = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = (reqBody === null || reqBody === void 0 ? void 0 : reqBody.body) || {};
    console.log('inside webhook', payload);
    if (!payload || !(payload === null || payload === void 0 ? void 0 : payload.status) || (payload === null || payload === void 0 ? void 0 : payload.status) !== 'VALID') {
        console.log('error 1', payload);
        return {
            message: 'Invalid payment!'
        };
    }
    const result = yield ssl_service_1.sslService.validate(payload);
    if ((result === null || result === void 0 ? void 0 : result.status) !== 'VALID') {
        console.log('error 2', result);
        return {
            message: 'Invalid payment.'
        };
    }
    const { tran_id } = result;
    const prismaResult = yield prisma_1.default.payment.updateMany({
        where: {
            transactionId: tran_id
        },
        data: {
            status: 'PAID',
            paymentGatewayData: payload
        }
    });
    console.log('prismaResult', prismaResult);
    const apiKeyForEcommercePayment = config_1.default.apiKeyForEcommercePayment;
    console.log('apiKeyForEcommercePayment', apiKeyForEcommercePayment);
    const completePayment = yield axios_1.ApiGatewayService.post('/student-semester-payments/complete-payment', {
        transactionId: tran_id,
        apiKey: apiKeyForEcommercePayment ////TODO: have to do it with only using headers
    }, {
        headers: {
            // ...reqBody?.headers,
            'X-API-KEY': apiKeyForEcommercePayment
        }
    });
    console.log('completePayment', completePayment);
    return {
        message: 'Payment Successful'
    };
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.PaginationHelper.getPaginationOptions(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: payment_constants_1.paymentSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.payment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: 'desc'
            }
    });
    const total = yield prisma_1.default.payment.count({
        where: whereConditions
    });
    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.payment.findUnique({
        where: {
            id
        }
    });
    return result;
});
const paymentSuccessResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('success payment');
    console.log(req.query);
    console.log(req.body);
    // const response: IGenericResponse = await PaymentService.post(
    //   '/payment/success',
    //   {
    //     params: req.query,
    //     headers: {
    //       Authorization: req.headers.authorization
    //     }
    //   }
    // );
    // return response;
    return {
        data: {
            query: req.query,
            body: req.body
        },
        message: 'Payment Successful'
    };
});
exports.PaymentService = {
    initPayment,
    webhook,
    getAllFromDB,
    getByIdFromDB,
    paymentSuccessResponse
};
