import { Router } from 'express';
import * as cardController from '../controllers/cardController';
import { validateSchema } from '../middlewares/schemaValidator';
import { createCardSchema } from '../schemas/createCardSchema';
import { validateApiKey } from '../middlewares/apiKeyValidator';



const cardRouter = Router();

cardRouter.get('/cards', cardController.getCards);

cardRouter.post('/create-card', validateApiKey, validateSchema(createCardSchema), cardController.createCard);


export default cardRouter;