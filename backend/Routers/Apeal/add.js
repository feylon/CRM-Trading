import { Router } from "express";
import Joi from "joi";

const router = Router();

router.post("/", async function(req, res){
let Schema = Joi.object({
    firstname : Joi.string().required(),
    lastname : Joi.string().required(),
    description : Joi.string().required(),
    phone : Joi.string().required()
});
const checkSchema = Schema.validate(req.body);
if (checkSchema.error) return res.status(400).send({error : checkSchema.error.message});

const {firstname, lastname, description, phone} = req.body;


try {
    
    await global.pool.query(
        `
        
insert into apeal (firstname, lastname, description, phone)
values ($1, $2, $3, $4);
        `, [firstname, lastname, description, phone]);
        return res.status(201).send({Created : true})


} catch (error) {
    console.log(error)
}
});

export default router;