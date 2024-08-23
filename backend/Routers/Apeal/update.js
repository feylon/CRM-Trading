import { Router } from "express";
import Joi from "joi";
import {checkToken} from "../../functions/jwtadmin.js"

const router = Router();

router.post("/byid/:id", checkToken, async function (req, res){
let Schemaparams = Joi.object({
    id : Joi.number().min(0).integer().required()
});
    const {id} = req.params;
    let checkSchemaparams = Schemaparams.validate(req.params);
    if(checkSchemaparams.error) 
        return res.status(400).send({error : checkSchemaparams.error.message});

let Schema = Joi.object({
    status : Joi.number().required().integer().min(0),
    reseen : Joi.date().min('2024-08-22').max('2029-11-11')
});
    let checkSchema = Schema.validate(req.body);
    if(checkSchema.error) return res.status(400).send({error : checkSchema.error.message})    
    let {status, reseen} = req.body;
    if(reseen && status == 3) {
        try {
            await global.pool.query(
                `update apeal set status = $1, reseen = $2 where id = $3`,
                [status, reseen, id]
            );
           return res.status(200).send({edited : true});

        } catch (error) {
            if(error.code == '23503') return res.status(400).send({error : error.detail});
            console.log(error);
            return;
        }
    }


     {
        try {
            await global.pool.query(
                `update apeal set status = $1  where id = $2`,
                [status,  id]
            );
           return res.status(200).send({edited : true});

        } catch (error) {
            if(error.code == '23503') return res.status(400).send({error : error.detail});
            
            console.log(error);

            return;
        }
    }

});



 export default router;   