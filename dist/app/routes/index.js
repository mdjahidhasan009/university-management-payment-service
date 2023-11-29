"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_routes_1 = require("../modules/payment/payment.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/payment',
        routes: payment_routes_1.paymentRoutes
    }
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.routes);
});
exports.default = router;
