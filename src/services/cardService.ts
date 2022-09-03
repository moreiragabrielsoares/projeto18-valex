import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import * as cardRepository from '../repositories/cardRepository'

dotenv.config();


export async function getAllCards () {

    const allCards = await cardRepository.find();

    return allCards;
}


async function checkDuplicateCard (cardType: cardRepository.TransactionTypes, employeeId: number) {

    const checkCard = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId);

    if (checkCard) {
        throw {code: 'Conflict' , message: 'Card already exists'};
    }

    return null;

}

function generateExpirationDate() {
    
    const expirationDate = dayjs(Date.now()).add(5, 'year').format('MM/YY');
    
    return expirationDate;
}

function generateNewCardNumber() {
    return faker.finance.creditCardNumber('####-####-####-####');
}

function generateNewCvvNumber() {
    return faker.finance.creditCardCVV();
}

function encryptCvvNumber(cvvNumber: string) {
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.CRYPTR_KEY);
    const encryptedCvvNumber = cryptr.encrypt(cvvNumber);
    return encryptedCvvNumber;
}

function decryptCvvNumber(encryptedCvvNumber: string) {
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.CRYPTR_KEY);
    const decryptedCvvNumber = cryptr.decrypt(encryptedCvvNumber);
    return decryptedCvvNumber;
}

export async function createCard (employeeId: number, cardType: cardRepository.TransactionTypes, cardholderName: string) {

    await checkDuplicateCard(cardType, employeeId);

    const expirationDate = generateExpirationDate();

    const newCardNumber = generateNewCardNumber();

    const encryptedCvvNumber = encryptCvvNumber(generateNewCvvNumber());

    const cardData = {
        employeeId,
        number: newCardNumber,
        cardholderName,
        securityCode: encryptedCvvNumber,
        expirationDate,
        isVirtual: false,
        isBlocked: true,
        type: cardType
    };
    
    await cardRepository.insert(cardData);

    return;
}