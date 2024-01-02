"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
const envVarsZodSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.string(),
    PORT: zod_1.z
        .string()
        .default('3000')
        .refine((val) => Number(val)),
    DATABASE_URL: zod_1.z.string(),
    REDIS_URL: zod_1.z.string(),
    JWT_SECRET: zod_1.z.string(),
    STORE_ID: zod_1.z.string(),
    STORE_PASS: zod_1.z.string(),
    SSL_BASE_PAYMENT_URL: zod_1.z.string(),
    SSL_BASE_VALIDATION_URL: zod_1.z.string(),
    CORS: zod_1.z.string().transform((cors) => cors.split(',')),
    API_GATEWAY_URL: zod_1.z.string(),
    FRONTEND_URL: zod_1.z.string(),
    API_KEY_FOR_ECOMMERCE_PAYMENT: zod_1.z.string()
});
const envVars = envVarsZodSchema.parse(process.env);
exports.default = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    db: {
        url: envVars.DATABASE_URL
    },
    redis: {
        url: envVars.REDIS_URL
    },
    jwt: {
        secret: envVars.JWT_SECRET
    },
    ssl: {
        storeId: envVars.STORE_ID,
        storePass: envVars.STORE_PASS,
        sslPaymentUrl: envVars.SSL_BASE_PAYMENT_URL,
        sslValidationUrl: envVars.SSL_BASE_VALIDATION_URL
    },
    cors: envVars.CORS,
    apiGatewayUrl: envVars.API_GATEWAY_URL,
    frontendUrl: envVars.FRONTEND_URL,
    apiKeyForEcommercePayment: envVars.API_KEY_FOR_ECOMMERCE_PAYMENT
};
