import { checkToken } from "../../functions/jwtadmin.js";
import Joi from "joi";
import { Router } from "express";
const router = Router();


router.post("/", checkToken, async function (req, res) {
  const Schema = Joi.object({
    active : Joi.boolean().required(),
    id : Joi.number().required()
});

  let checkSchema = Schema.validate(req.body);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });

  const {active, id} = req.body;
  try {
    let data = await global.pool.query(
      `update calendar set active = $1 where id = $2;`,
      [active, id]
    );
    res.status(201).send({ created: "Success :)" });
  } catch (error) {
    res.status(400).send({ error: "Server xatolikga uchradi" });
    console.log(error);
  }
});

export default router;
