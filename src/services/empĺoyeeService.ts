import * as employeeRepository from '../repositories/employeeRepository';


function generateCardholderName (fullname: string) {
    
    const namesArray = fullname.toUpperCase().split(" ");
    
    let cardholderName = namesArray[0] + " ";

    for (let i = 1 ; i < namesArray.length ; i++) {
        
        if (i === namesArray.length - 1) {
            cardholderName += namesArray[i];
            break;
        }

        if (namesArray[i].length < 3) {
            continue;
        }

        cardholderName += namesArray[i][0] + " ";
    }

    cardholderName = cardholderName.trim();

    return cardholderName;
}



export async function employeeFindById(employeeId: number, companyId: number) {

    const employee = await employeeRepository.findById(employeeId);

    if (!employee) {
        throw {code: 'NotFound' , message: 'Invalid employeeId'};
    }

    if (employee.companyId !== companyId) {
        throw {code: 'Conflict' , message: 'Company and Employee do not match'};
    }

    const cardholderName = generateCardholderName(employee.fullName);

    return {employee, cardholderName};
}


export async function checkEmployeeCompany(companyId: number, employeeId:number) {

    const employee = await employeeRepository.findById(employeeId);

    if (employee.companyId !== companyId) {
        throw {code: 'Conflict' , message: 'Company and Employee do not match'};
    }

    return;
}