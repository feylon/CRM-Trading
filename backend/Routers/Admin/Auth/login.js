import { Router } from "express";
import { check } from "../../../functions/bcrypt.js";
import Joi from "joi";
import { sign } from "../../../functions/jwtadmin.js";
import rateLimit from "express-rate-limit";

const router = Router();

let loginLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: Number(process.env.LOGIN_LIMIT || 20),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Juda ko'p urinish. 10 daqiqadan keyin qayta urinib ko'ring" },
});

router.post("/", loginLimit, async function (req, res) {
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
      "Select id, password from admin where login = $1 and state = true",
      [login]
    );
    if (data.rows.length == 0)
      return res.status(400).send({ error: "Login or password error" });

    const isLogin = await check(password, data.rows[0].password);
    if (!isLogin) {
      return res.status(400).send({ error: "Login or password error" });
    }
    req.session.adminId = data.rows[0].id;
    req.session.IsAdmin = true;
    req.session.clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    res.status(200).send({ token: sign(Number(data.rows[0].id)) });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server xatolikga uchradi" });
  }
});

export default router;
