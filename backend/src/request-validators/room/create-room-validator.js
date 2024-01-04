import Joi from "joi";

//TODO fix proporties
const createRoomValidator = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    //
})
    .with("username", "birth_year")
    .xor("paasword", "access_token")
    .with("pasword", "repeat_password")

export default createRoomValidator;