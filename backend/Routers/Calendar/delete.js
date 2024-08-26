import { Router } from "express";
import Joi from "joi";
import { checkToken } from "../../functions/jwtadmin.js";

let router = Router();

router.delete("/:id", checkToken, async function (req, res) {
  let Schemaparams = Joi.object({
    id: Joi.number().min(0).integer().required(),
  });

  const { id } = req.params;

  try {
    await global.pool.query(`delete from calendar where id = $1`, [id]);
    return res.status(200).send({ delete: true });
  } catch (error) {
    res.status(400).send({ error: "Server xatolikga uchradi" });
    console.log(error);
    return;
  }
});
export default router;
