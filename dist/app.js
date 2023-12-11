"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const globalExceptionHandler_1 = __importDefault(require("./app/middlewares/globalExceptionHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
//
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if ((config.cors && config.cors.includes(<string>origin)) || !origin) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true
//   })
// );
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/v1', routes_1.default);
app.get('/', (req, res) => {
    res.send('Server running successfully');
});
app.use(globalExceptionHandler_1.default);
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'API not found',
        errorMessages: [
            {
                path: '',
                message: 'API not found'
            }
        ]
    });
});
exports.default = app;
