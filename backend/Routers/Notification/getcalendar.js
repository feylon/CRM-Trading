import { Router } from "express";
import { checkToken } from "../../functions/jwtadmin.js";

const router = Router();
router.get("/", checkToken, async (req, res, next) => {
  try {
    let data = await global.pool.query(`
        SELECT * 
FROM calendar
WHERE start_time < NOW() 
  AND NOW() < end_time;
  
        `);

    res.status(200).send(data.rows);
  } catch (error) {
    console.log(error);
  }
});

export default router;
