import { Router } from "express";
import { checkToken, get_id } from "../../../functions/jwtDean.js";
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
    tumanId: Joi.number().min(1).max(225).required(),
    viloyatId: Joi.number().min(1).max(15).required(),
  });
  let checkSchema = Schema.validate(req.body);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });
  const {
    email,
    firstname,
    lastname,
    brithday,
    address,
    Parent_Name,
    tumanId,
    viloyatId,
  } = req.body;
  try {
    const adminId = get_id(req, res);
    let data = await global.pool.query(
      `update dean 
set 
email = $1,
firstname = $2,
lastname = $3,
brithday = $4,
address = $5,
Parent_Name = $6,
tuman_id = $7,
viloyat_id = $8
where id = $9`,

      [
        email,
        firstname,
        lastname,
        brithday,
        address,
        Parent_Name,
        tumanId,
        viloyatId,
        adminId,
      ]
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
