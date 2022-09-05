import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import * as cardRepository from '../repositories/cardRepository';
import * as rechargeRepository from '../repositories/rechargeRepository';
import * as paymentRepository from '../repositories/paymentRepository';

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
    return;
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
    console.log(cvvNumber);
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



function checkIsCardExpired(expirationDate: string) {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const expirationMonth = parseInt(expirationDate.substring(0,2)); //expirationDate = "MM/YY"
    const expirationYear = 2000 + parseInt(expirationDate.substring(3,5));
    return ((currentYear > expirationYear) || (currentYear === expirationYear && currentMonth > expirationMonth));
}

function checkCvvNumber(encryptedCvvNumber: string, cardCvv: string) {
    const decryptedCvvNumber = decryptCvvNumber(encryptedCvvNumber);
    return (cardCvv === decryptedCvvNumber);
}

function encryptPassword(password: string) {
    const encryptedPassword = bcrypt.hashSync(password, 10);
    return encryptedPassword;
}

export async function checkCardbyId (cardId: number, cardCvv: string) {

    const card = await cardRepository.findById(cardId);

    if (!card) {
        throw {code: 'NotFound' , message: 'Invalid cardId'};
    }

    if (!checkCvvNumber(card.securityCode, cardCvv)) {
        throw {code: 'Unauthorized' , message: 'Invalid credentials'}
    }

    if (checkIsCardExpired(card.expirationDate)) {
        throw {code: 'Unprocessable' , message: 'Expired card'};
    }

    if (card.password) {
        throw {code: 'Unprocessable' , message: 'Card already activated'};
    }

    return;
}

export async function activateCard (cardId: number, password:string) {

    const encryptedPassword = encryptPassword(password);

    await cardRepository.update(cardId, {password: encryptedPassword});

    return;
}



export async function blockCard(cardId: number, password: string) {
    
    const card = await cardRepository.findById(cardId);

    if (!card) {
        throw {code: 'NotFound' , message: 'Invalid cardId'};
    }

    if (checkIsCardExpired(card.expirationDate)) {
        throw {code: 'Unprocessable' , message: 'Expired card'};
    }

    if (card.isBlocked) {
        throw {code: 'Unprocessable' , message: 'Card already blocked'};
    }

    if (!card.password) {
        throw {code: 'Unprocessable' , message: 'Not activated card'};
    }

    if (!bcrypt.compareSync(password, card.password!)) {
        throw {code: 'Unauthorized' , message: 'Invalid credentials'};
    }

    await cardRepository.update(cardId, {isBlocked: true});
    return;
}

export async function unblockCard(cardId: number, password: string) {
    
    const card = await cardRepository.findById(cardId);

    if (!card) {
        throw {code: 'NotFound' , message: 'Invalid cardId'};
    }

    if (checkIsCardExpired(card.expirationDate)) {
        throw {code: 'Unprocessable' , message: 'Expired card'};
    }

    if (!card.isBlocked) {
        throw {code: 'Unprocessable' , message: 'Card already unblocked'};
    }

    if (!card.password) {
        throw {code: 'Unprocessable' , message: 'Not activated card'};
    }

    if (!bcrypt.compareSync(password, card.password!)) {
        throw {code: 'Unauthorized' , message: 'Invalid credentials'};
    }

    await cardRepository.update(cardId, {isBlocked: false});
    return;
}




export async function checkReloadCardById (cardId: number) {

    const card = await cardRepository.findById(cardId);

    if (!card) {
        throw {code: 'NotFound' , message: 'Invalid cardId'};
    }

    if (!card.password) {
        throw {code: 'Unprocessable' , message: 'Not activated card'};
    }

    if (checkIsCardExpired(card.expirationDate)) {
        throw {code: 'Unprocessable' , message: 'Expired card'};
    }

    return card;
}


export async function reloadCardById (cardId: number, amount: number) {

    const rechargeData = { cardId, amount }

    await rechargeRepository.insert(rechargeData);
    return;
}


export async function checkPaymentCardPosById (cardId: number, password: string) {

    const card = await cardRepository.findById(cardId);

    if (!card) {
        throw {code: 'NotFound' , message: 'Invalid cardId'};
    }

    if (!card.password) {
        throw {code: 'Unprocessable' , message: 'Not activated card'};
    }

    if (checkIsCardExpired(card.expirationDate)) {
        throw {code: 'Unprocessable' , message: 'Expired card'};
    }

    if (card.isBlocked) {
        throw {code: 'Unprocessable' , message: 'Blocked card'};
    }

    if (!bcrypt.compareSync(password, card.password!)) {
        throw {code: 'Unauthorized' , message: 'Invalid credentials'};
    }

    return card;
}


export async function checkCardBalance(cardId: number, amount: number) {

    const payments = await paymentRepository.findByCardId(cardId);
    const reloads = await rechargeRepository.findByCardId(cardId);

    let totalPayments = 0;
    let totalReloads = 0;

    for (let i = 0 ; i < payments.length ; i++) {
        totalPayments += payments[i].amount;
    }

    for (let j = 0 ; j < reloads.length ; j++) {
        totalReloads += reloads[j].amount;
    }

    const cardBalance = totalReloads - totalPayments;

    if (amount > cardBalance) {
        throw {code: 'Unprocessable' , message: 'Unprocessable value'};
    }

    return;
}



export async function checkCardPassword(cardId: number, password: string) {
    
    const card = await cardRepository.findById(cardId);

    if (!card) {
        throw {code: 'NotFound' , message: 'Invalid cardId'};
    }

    if (!card.password) {
        throw {code: 'Unprocessable' , message: 'Not activated card'};
    }

    if (!bcrypt.compareSync(password, card.password!)) {
        throw {code: 'Unauthorized' , message: 'Invalid credentials'};
    }

    return;
}

export async function getCardStatement(cardId: number) {

    const payments = await paymentRepository.findByCardId(cardId);
    const reloads = await rechargeRepository.findByCardId(cardId);

    let totalPayments = 0;
    let totalReloads = 0;

    for (let i = 0 ; i < payments.length ; i++) {
        totalPayments += payments[i].amount;
    }

    for (let j = 0 ; j < reloads.length ; j++) {
        totalReloads += reloads[j].amount;
    }

    const cardBalance = totalReloads - totalPayments;

    const cardStatement = {balance: cardBalance, transactions: payments, recharges: reloads};

    return cardStatement;
}