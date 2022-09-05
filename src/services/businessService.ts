import * as businessRepository from '../repositories/businessRepository';


export async function getBusinessById(businessId: number) {

    const business = await businessRepository.findById(businessId);

    if (!business) {
        throw {code: 'NotFound' , message: 'Invalid businessId'}
    }

    return business;
}
