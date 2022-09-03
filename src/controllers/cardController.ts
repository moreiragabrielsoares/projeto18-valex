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