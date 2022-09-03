import { Router } from 'express';
import * as cardController from '../controllers/cardController';
import { validateSchema } from '../middlewares/schemaValidator';
import { createCardSchema, activateCardSchema } from '../schemas/createCardSchema';
import { validateApiKey } from '../middlewares/apiKeyValidator';



const cardRouter = Router();

cardRouter.get('/cards', cardController.getCards);

cardRouter.post('/create-card', validateApiKey, validateSchema(createCardSchema), cardController.createCard);

cardRouter.put('/activate-card', validateSchema(activateCardSchema), cardController.activateCard);


export default cardRouter;