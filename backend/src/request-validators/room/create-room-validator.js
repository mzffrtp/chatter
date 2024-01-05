import Joi from "joi";

//TODO fix proporties
const createRoomValidator = Joi.object({
    name: Joi
        .string()
        .min(3)
        .max(30)
        .required()
        .pattern(new RegExp("^[a-zA-Z0-9 -_çöşüğıÖÇŞİĞÜ]$")),
    visibility: Joi.string(),
    maxClient: Joi.number().integer().min(0).max(100),
})
    .with("username", "birth_year")
    .xor("paasword", "access_token")
    .with("pasword", "repeat_password")

export default createRoomValidator;