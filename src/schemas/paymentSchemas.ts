import joi from 'joi';


const paymentPosSchema = joi.object({
    cardId: joi.number().integer().required(),
    password: joi.string().length(4).pattern(/^[0-9]*$/).required(),
    businessId: joi.number().integer().required(),
    amount: joi.number().positive().integer().required()
});

export { paymentPosSchema };