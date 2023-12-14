import { Request, Response, NextFunction } from 'express';
import { PaymentService } from './payment.service';
import sendResponse from '../../../shared/response';
import httpStatus from 'http-status';
import { paymentFilterableFields } from './payment.constants';
import pick from '../../../shared/pick';

const initPayment = async (req: Request, res: Response, next: NextFunction) => {
  const result = await PaymentService.initPayment(req.body);

  if (!result) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Payment init failed!',
      data: result
    });
  } else {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Payment init successful!',
      data: result
    });
  }
};

const webhook = async (req: Request, res: Response, next: NextFunction) => {
  console.log('webhook called');
  console.log('req.query', req.query);
  console.log('req.body', req.body);
  // const result = await PaymentService.webhook(req.query, req.body);
  const result = await PaymentService.webhook(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment verified!',
    data: result
  });

  // res.send(result);
};

const getAllFromDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = pick(req.query, paymentFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await PaymentService.getAllFromDB(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payments fetched successfully',
      meta: result.meta,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

const getByIdFromDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await PaymentService.getByIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment fetched successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const paymentSuccessResponse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await PaymentService.paymentSuccessResponse(req, res);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const PaymentController = {
  initPayment,
  webhook,
  getAllFromDB,
  getByIdFromDB,
  paymentSuccessResponse
};
