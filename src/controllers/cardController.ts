import { Request, Response } from 'express';
import * as cardService from '../services/cardService';


export async function getCards(req: Request, res: Response) {

    const result = cardService.getAllCards();

    res.status(200).send(result);

}