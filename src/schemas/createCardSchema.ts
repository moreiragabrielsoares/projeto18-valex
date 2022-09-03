import joi from 'joi';

const createCardSchema = joi.object({
    employeeId: joi.number().integer().required(),
    cardType: joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health').required()
});

const activateCardSchema = joi.object({
    cardId: joi.number().integer().required(),
    cardCvv: joi.string().length(3).pattern(/^[0-9]*$/).required(),
    password: joi.string().length(4).pattern(/^[0-9]*$/).required()
});

export { createCardSchema, activateCardSchema };