import {Router} from "express";
import { checkToken } from "../../functions/jwtadmin.js";
import Joi from "joi";


const router = Router();
router.get("/", checkToken, async function(req, res){
    try {
        let data = await global.pool.query(`
            select * from calendar;
            `);
            res.status(200).send(data.rows)

    } catch (error) {
        console.log(error)
    }
});


export default router;
