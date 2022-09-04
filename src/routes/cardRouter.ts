import { Router } from 'express';
import * as cardController from '../controllers/cardController';
import { validateSchema } from '../middlewares/schemaValidator';
import { createCardSchema, activateCardSchema, blockCardSchema } from '../schemas/createCardSchema';
import { validateApiKey } from '../middlewares/apiKeyValidator';



const cardRouter = Router();

cardRouter.get('/cards', cardController.getCards);

cardRouter.post('/create-card', validateApiKey, validateSchema(createCardSchema), cardController.createCard);

cardRouter.put('/activate-card', validateSchema(activateCardSchema), cardController.activateCard);

cardRouter.put('/block-card', validateSchema(blockCardSchema), cardController.blockCard);

cardRouter.put('/unblock-card', validateSchema(blockCardSchema), cardController.unblockCard);


export default cardRouter;