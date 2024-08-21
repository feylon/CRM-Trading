import { Router } from "express";
import { check } from "../../../functions/bcrypt.js";
import Joi from "joi";
import { sign } from "../../../functions/jwtadmin.js";

const router = Router();

router.post("/", async function (req, res) {
  let Schema = Joi.object({
    login: Joi.string().required().min(0).max(25),
    password: Joi.string().required().min(0).max(50),
  });
  if (Schema.validate(req.body).error)
    return res
      .status(400)
      .send({ error: Schema.validate(req.body).error.message });
  const { login, password } = req.body;
  try {
    let data = await global.pool.query(
      "Select id, password from admin where login = $1",
      [login]
    );
    if (data.rows.length == 0)
      return res.status(400).send({ error: "Login or password error" });

    const isLogin = await check(password, data.rows[0].password);
    if (!isLogin) {
      return res.status(400).send({ error: "Login or password error" });
    }
    res.status(200).send({ token: sign(Number(data.rows[0].id)) });
  } catch (error) {
    console.log(error);
  }
});

export default router;
