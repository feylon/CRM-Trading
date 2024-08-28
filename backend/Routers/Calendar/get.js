import {Router} from "express";
import { checkToken } from "../../functions/jwtadmin.js";
import Joi from "joi";


const router = Router();
router.get("/", checkToken, async function(req, res){
    try {
        let data = await global.pool.query(`
            SELECT
    id,
    url,
    title,
    json_build_object('start', start_time, 'end', end_time) as time,
    description,
    image,
    tags,
    location
FROM
    calendar;

            `);
            res.status(200).send(data.rows)

    } catch (error) {
        console.log(error)
    }
});



export default router;
