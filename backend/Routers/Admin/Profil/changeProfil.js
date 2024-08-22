import { Router } from "express";
import { checkToken, get_id } from "../../../functions/jwtadmin.js";
import Joi from "joi";

const router = Router();

router.post("/", checkToken, async function (req, res) {
  let Schema = Joi.object({
    email: Joi.string().email().required().min(3).max(45),
    firstname: Joi.string().required().min(3).max(15),
    lastname: Joi.string().required().min(3).max(15),
    brithday: Joi.string().required(),
    address: Joi.string().required().min(3).max(45),
    Parent_Name: Joi.string().required().min(3).max(45),
  });
  let checkSchema = Schema.validate(req.body);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });
  const { email, firstname, lastname, brithday, address, Parent_Name } =
    req.body;
  try {
    const adminId = get_id(req, res);
    let data = await global.pool.query(
      `update admin 
set 
email = $1,
firstname = $2,
lastname = $3,
brithday = $4,
address = $5,
Parent_Name = $6
where id = $7`,

      [email, firstname, lastname, brithday, address, Parent_Name, adminId]
    );

    res.send({ Edited: true });
  } catch (error) {
    if (error.code == "22008")
      return res.status(400).send({ error: error.hint });
    if (error.code == "23505")
      return res.status(400).send({ error: error.detail });

    if (error.code == "22P02")
      return res.status(400).send({ error: error.severity });
    console.log(error);
  }
});
export default router;
