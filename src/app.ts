import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import httpStatus from 'http-status';
import globalExceptionHandler from './app/middlewares/globalExceptionHandler';
import routes from './app/routes';
import config from './config';

const app: Application = express();
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

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', routes);

app.get('/', (req, res) => {
  res.send('Server running successfully');
});

app.use(globalExceptionHandler);

app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
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

export default app;
