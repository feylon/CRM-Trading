import { Router } from "express";
import Joi from "joi";
import { checkToken, get_id } from "../../../functions/jwtadmin.js";
import { joiPasswordExtendCore } from "joi-password";
import { check, hash } from "../../../functions/bcrypt.js";
const joiPassword = Joi.extend(joiPasswordExtendCore);

const router = Router();

router.post("/", checkToken, async function (req, res) {
  let Schema = Joi.object({
    oldpassword: Joi.string().required(),
    newpassword: joiPassword
      .string()
      .minOfSpecialCharacters(1)
      .minOfLowercase(2)
      .minOfUppercase(1)
      .minOfNumeric(2)
      .noWhiteSpaces()
      .onlyLatinCharacters()
      .doesNotInclude(["password"])
      .required(),
    confirmpassword: Joi.string().required(),
  });
  let change_password;
  let adminId = get_id(req, res);
  let checkvalidate = Schema.validate(req.body);
  if (checkvalidate.error)
    return res.status(400).send({ error: checkvalidate.error.message });
  const { confirmpassword, newpassword, oldpassword } = req.body;
  if (confirmpassword != newpassword)
    return res.status(400).send({ error: "Yangi parollar bir xil emas" });

  try {
    let data = await global.pool.query(
      `Select password from admin where id = $1`,
      [adminId]
    );
    let isTrue = await check(oldpassword, data.rows[0].password);
    if (!isTrue) return res.status(400).send({ error: "Eski parol xato" });
    change_password = await hash(newpassword);
  } catch (error) {
    console.log(error);
  }

  try {
    await global.pool.query("update admin set password = $1 where id = $2", [
      change_password,
      adminId,
    ]);
    return res.status(201).send({ Edited: true });
  } catch (error) {
    console.log(error);
  }
});
export default router;
