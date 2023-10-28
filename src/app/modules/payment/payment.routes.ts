import express from 'express';
import { PaymentController } from './payment.controller';
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post('/', PaymentController.initPayment);
router.post('/webhook', PaymentController.webhook);

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  PaymentController.getAllFromDB
);
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  PaymentController.getByIdFromDB
);

export const paymentRoutes = router;
