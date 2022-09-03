import * as companyRepository from '../repositories/companyRepository';


export async function companyFindByApiKey(apiKey: string) {

    const company = await companyRepository.findByApiKey(apiKey);

    if (!company) {
        throw {code: 'NotFound' , message: 'Invalid Api Key'}
    }

    return company;

}