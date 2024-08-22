import { Router } from "express";
import { checkToken } from "../../functions/jwtadmin.js";
import Joi from "joi";
const router = Router();

router.get("/all",  async function(req, res){
    const Schema = Joi.object(
        {
            size : Joi.number().integer().min(0).required(),
            page : Joi.number().integer().min(0).required()
            
        }
    );
    let checkSchema = Schema.validate(req.query);
    if (checkSchema.error) return res.status(400).send({error : checkSchema.error.message});
    try {
        const { page, size} = req.query;

        let data = await global.pool.query(
            `
WITH total AS (
    SELECT COUNT(*) AS total
    FROM apeal
    INNER JOIN apealstatus ON apealstatus.id = apeal.status
),
paged AS (
    SELECT 
        apeal.id AS id,
        apeal.firstname,
        apeal.lastname,
        apeal.created_at,
        apeal.description,
        apeal.phone,
        apeal.status,
        apeal.reseen,
        apealstatus.id AS status_id,
        apealstatus.name AS statusName
    FROM apeal
    INNER JOIN apealstatus ON apealstatus.id = apeal.status
    ORDER BY apeal.created_at DESC
    LIMIT $1 OFFSET ($2 - 1) * $1
)
SELECT 
    paged.*,
    total.total
FROM paged, total;

`, 
 [size, page]

        );
 const {rows}  = data;
    res.status(200).send(rows);

    } catch (error) {
        console.log(error)
    }
});

export default router;