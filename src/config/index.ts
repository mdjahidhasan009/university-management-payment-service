import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envVarsZodSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z
    .string()
    .default('3000')
    .refine((val) => Number(val)),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  JWT_SECRET: z.string(),
  STORE_ID: z.string(),
  STORE_PASS: z.string(),
  SSL_BASE_PAYMENT_URL: z.string(),
  SSL_BASE_VALIDATION_URL: z.string(),
  CORS: z.string().transform((cors) => cors.split(',')),
  API_GATEWAY_URL: z.string(),
  FRONTEND_URL: z.string(),
  API_KEY_FOR_ECOMMERCE_PAYMENT: z.string()
});

const envVars = envVarsZodSchema.parse(process.env);

export default {
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
