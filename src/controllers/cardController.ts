import { Request, Response } from 'express';
import { TransactionTypes } from '../repositories/cardRepository';
import * as cardService from '../services/cardService';
import * as companyService from '../services/companyService';
import * as employeeService from '../services/empĺoyeeService';


export async function getCards(req: Request, res: Response) {

    const result = await cardService.getAllCards();

    res.status(200).send(result);

}


export async function createCard(req: Request, res: Response) {

    const apiKey = res.locals.apiKey;

    const { employeeId, cardType }:{employeeId:number, cardType:TransactionTypes} = req.body;

    const company = await companyService.companyFindByApiKey(apiKey);

    const {employee, cardholderName} = await employeeService.employeeFindById(employeeId, company.id);

    await cardService.createCard(employeeId, cardType, cardholderName);

    res.status(201).send('Card created');

}


export async function activateCard(req: Request, res: Response) {

    const { cardId, cardCvv, password }:{cardId:number, cardCvv:string, password:string} = req.body;

    await cardService.checkCardbyId(cardId, cardCvv);

    await cardService.activateCard(cardId, password);

    res.status(200).send('Card activated');

}


export async function blockCard(req: Request, res: Response) {

    const { cardId, password }:{cardId:number, password:string} = req.body;

    await cardService.blockCard(cardId, password);

    res.status(200).send('Card blocked');

}

export async function unblockCard(req: Request, res: Response) {

    const { cardId, password }:{cardId:number, password:string} = req.body;

    await cardService.unblockCard(cardId, password);

    res.status(200).send('Card unblocked');

}



export async function reloadCard(req: Request, res: Response) {

    const apiKey = res.locals.apiKey;

    const { cardId, reloadValue }:{ cardId:number, reloadValue: number } = req.body;

    const company = await companyService.companyFindByApiKey(apiKey);
    
    const card = await cardService.checkReloadCardById(cardId);

    await employeeService.checkEmployeeCompany(company.id, card.employeeId);

    await cardService.reloadCardById(cardId, reloadValue);

    res.status(200).send('Card reloaded');

}
