import { Request, Response } from 'express';
import * as cardService from '../services/cardService';
import * as businessService from '../services/businessService';
import * as paymentService from '../services/paymentService';



export async function postPaymentPos(req: Request, res: Response) {

    const { cardId, password, businessId, amount }:
        {cardId:number, password:string, businessId:number, amount:number} = req.body
    ;

    const business = await businessService.getBusinessById(businessId);

    const card = await cardService.checkPaymentCardPosById(cardId, password);

    await paymentService.checkCardAndBusinessTypes(card.type, business.type);

    await cardService.checkCardBalance(cardId, amount);

    await paymentService.registerPayment(cardId, businessId, amount);

    res.status(201).send('Payment posted');

}
