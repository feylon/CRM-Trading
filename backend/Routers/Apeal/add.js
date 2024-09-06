import { Router } from "express";
import Joi from "joi";
import rateLimit from "express-rate-limit";

const router = Router();

let spam = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: Number(process.env.APEAL_LIMIT || 10),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Siz juda ko'p murojaat yubordingiz, keyinroq urinib ko'ring" }
});

router.post("/", spam, async function(req, res){
let Schema = Joi.object({
    firstname : Joi.string().trim().min(2).max(50).required(),
    lastname : Joi.string().trim().min(2).max(50).required(),
    description : Joi.string().trim().min(3).max(500).required(),
    phone : Joi.string().trim().pattern(/^\+?[0-9 ()-]{9,20}$/).required()
        .messages({"string.pattern.base" : "Telefon raqam noto'g'ri formatda"})
});
const checkSchema = Schema.validate(req.body);
if (checkSchema.error) return res.status(400).send({error : checkSchema.error.message});

const {firstname, lastname, description, phone} = checkSchema.value;


try {
    
    await global.pool.query(
        `
        
insert into apeal (firstname, lastname, description, phone)
values ($1, $2, $3, $4);
        `, [firstname, lastname, description, phone]);
        return res.status(201).send({Created : true})


} catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server xatolikga uchradi" });
}
});

export default router;
