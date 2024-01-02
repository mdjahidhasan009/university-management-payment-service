import { sslService } from '../ssl/ssl.service';
import prisma from '../../../shared/prisma';
import { Payment, Prisma } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { paymentSearchableFields } from './payment.constants';
import { ApiGatewayService } from '../../../helpers/axios';
import config from '../../../config';

const initPayment = async (data: any) => {
  try {
    // "amount": 100,
    //   "transactionId": "", // use unique tran_id for each api call
    //   "studentName": "",
    //   "studentEmail": "",
    //   "address": "",
    //   "phone": ""
    const paymentSession = await sslService.initPayment({
      total_amount: data?.amount,
      tran_id: data?.transactionId, // use unique tran_id for each api call
      cus_name: data?.studentName,
      cus_email: data?.studentEmail,
      cus_add1: data?.address,
      // cus_add2: 'Dhaka',
      // cus_city: 'Dhaka',
      // cus_state: 'Dhaka',
      // cus_postcode: '1000',
      // cus_country: 'Bangladesh',
      cus_phone: data?.phone
    });

    await prisma.payment.create({
      data: {
        amount: data?.amount,
        transactionId: data?.transactionId,
        studentId: data?.studentId
      }
    });

    // console.log(paymentSession?.redirectGatewayURL);
    // const redirectURL = paymentSession?.redirectGatewayURL;

    return paymentSession?.data?.redirectGatewayURL;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const webhook = async (reqBody: any) => {
  const payload = reqBody?.body || {};
  console.log('inside webhook', payload);

  if (!payload || !payload?.status || payload?.status !== 'VALID') {
    console.log('error 1', payload);
    return {
      message: 'Invalid payment!'
    };
  }

  const result = await sslService.validate(payload);
  if (result?.status !== 'VALID') {
    console.log('error 2', result);
    return {
      message: 'Invalid payment.'
    };
  }

  const { tran_id } = result;
  const prismaResult = await prisma.payment.updateMany({
    where: {
      transactionId: tran_id
    },
    data: {
      status: 'PAID',
      paymentGatewayData: payload
    }
  });
  console.log('prismaResult', prismaResult);

  const apiKeyForEcommercePayment = config.apiKeyForEcommercePayment;
  console.log('apiKeyForEcommercePayment', apiKeyForEcommercePayment);
  const completePayment = await ApiGatewayService.post(
    '/student-semester-payments/complete-payment',
    {
      transactionId: tran_id,
      apiKey: apiKeyForEcommercePayment ////TODO: have to do it with only using headers
    },
    {
      headers: {
        // ...reqBody?.headers,
        'X-API-KEY': apiKeyForEcommercePayment
      }
    }
  );

  console.log('completePayment', completePayment);

  return {
    message: 'Payment Successful'
  };
};

const getAllFromDB = async (filters: any, options: any): Promise<IGenericResponse<Payment[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: paymentSearchableFields.map((field) => ({
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
          equals: (filterData as any)[key]
        }
      }))
    });
  }

  const whereConditions: Prisma.PaymentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.payment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc'
          }
  });
  const total = await prisma.payment.count({
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
};

const getByIdFromDB = async (id: string): Promise<Payment | null> => {
  const result = await prisma.payment.findUnique({
    where: {
      id
    }
  });
  return result;
};

const paymentSuccessResponse = async (req: any, res: any) => {
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
};

export const PaymentService = {
  initPayment,
  webhook,
  getAllFromDB,
  getByIdFromDB,
  paymentSuccessResponse
};
