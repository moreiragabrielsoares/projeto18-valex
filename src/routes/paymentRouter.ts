import { Router } from 'express';
import { validateSchema } from '../middlewares/schemaValidator';
import { paymentPosSchema } from '../schemas/paymentSchemas';
import * as paymentController from '../controllers/paymentController';



const paymentRouter = Router();


paymentRouter.post('/payment-pos', validateSchema(paymentPosSchema), paymentController.postPaymentPos);


export default paymentRouter;