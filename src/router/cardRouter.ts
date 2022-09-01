import { Router } from 'express';
import * as cardController from '../controllers/cardController'



const cardRouter = Router();

cardRouter.get('/cards', cardController.getCards);


export default cardRouter;