import bcrypt from 'bcrypt';
import * as businessRepository from '../repositories/businessRepository';
import * as paymentRepository from '../repositories/paymentRepository';

export async function checkCardAndBusinessTypes (cardType: string, bussinesType: string) {

    if (cardType !== bussinesType) {
        throw {code: 'Unprocessable' , message: 'Types do not match'};
    }

    return;
}


export async function registerPayment (cardId: number, businessId: number, amount: number) {

    const paymentData = {cardId, businessId, amount};

    await paymentRepository.insert(paymentData);

    return;
}