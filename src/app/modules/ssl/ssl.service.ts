import config from '../../../config';
// import axios from 'axios';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';
import { SSLPaymentService, SSLValidationService } from '../../../helpers/axios';

const initPayment = async (payload: any): Promise<any> => {
  try {
    const data: { [key: string]: string | number } = {
      store_id: config.ssl.storeId,
      store_passwd: config.ssl.storePass,
      total_amount: payload.total_amount,
      currency: 'BDT',
      tran_id: payload.tran_id, // use unique tran_id for each api call
      success_url: `${config.apiGatewayUrl}/payments?status=success`,
      fail_url: `${config.apiGatewayUrl}/payments?status=error`,
      cancel_url: `${config.apiGatewayUrl}/payments?status=warning`,
      ipn_url: `${config.apiGatewayUrl}/payments/webhook`,
      shipping_method: 'N/A',
      product_name: 'Semester Payment',
      product_category: 'Payment',
      product_profile: 'Student',
      cus_name: payload.cus_name,
      cus_email: payload.cus_email,
      cus_add1: payload.cus_add1,
      // cus_add2: payload.cus_add2,
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: payload.cus_phone,
      cus_fax: '01711111111',
      ship_name: 'Customer Name',
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh'
    };

    const params = new URLSearchParams();
    Object.keys(data).forEach((key: string) => {
      params.append(key, data[key] as string);
    });

    const response = await SSLPaymentService.post(config.ssl.sslPaymentUrl, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    ////TODO: will replace with SSL Service
    // const response = await axios({
    //   method: 'post',
    //   url: config.ssl.sslPaymentUrl,
    //   data: data,
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    // });
    // console.log(response);

    return { data: response };
  } catch (e) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment Error');
  }
};

const validate = async (data: any): Promise<any> => {
  try {
    const response = await SSLValidationService.get(
      `${config.ssl.sslValidationUrl}?val_id=${data.val_id}&store_id=${config.ssl.storeId}&store_passwd=${config.ssl.storePass}&format=json`
    );

    // const response = await axios({
    //   method: 'GET',
    //   url: `${config.ssl.sslValidationUrl}?val_id=${data.val_id}&store_id=${config.ssl.storeId}&store_passwd=${config.ssl.storePass}&format=json`
    // });
    console.log(response);
    return response;
    // return response?.data;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment error');
  }
};

export const sslService = {
  initPayment,
  validate
};
