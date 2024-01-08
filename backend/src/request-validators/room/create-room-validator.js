import Joi from "joi";

//TODO fix proporties
const createRoomValidator = Joi.object({
    name: Joi
        .string()
        .min(3)
        .max(30)
        .required()
        .pattern(new RegExp("^[a-zA-Z0-9 -_çöşüğıÖÇŞİĞÜ]+$"))
        .messages({
            'string.base': `Invalid type. Name should be a string.`,
            'string.empty': `Room name cannot be empty.`,
            'string.min': `Room name should have a minimum length of {#3}.`,
            'string.max': `Room name should have a maximum length of {#limit}.`,
            'string.pattern.base': `Invalid characters in the room name.`,
            'any.required': `Room name is required.`
        }),
    visibility: Joi
        .string()
        .messages({
            'string.base': `Invalid type. Name should be a string.`,
            'string.empty': `Visibilty cannot be empty.`,
        }),
    maxClient: Joi
        .number()
        .integer()
        .min(0)
        .max(100),
})


export default createRoomValidator;