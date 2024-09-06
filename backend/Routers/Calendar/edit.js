import { checkToken } from "../../functions/jwtadmin.js";
import Joi from "joi";
import { Router } from "express";
const router = Router();

let vaqt = (t) => {
  let d = new Date(t);
  let p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

router.post("/:id", checkToken, async function (req, res) {
  let id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).send({ error: "id noto'g'ri" });

  const Schema = Joi.object({
    url: Joi.string().max(255).allow("", null),
    title: Joi.string().min(3).max(255).required(),
    start_time: Joi.date().timestamp().required(),
    end_time: Joi.date().timestamp().required(),
    description: Joi.string().min(3).max(500).required(),
    tags: Joi.string().max(255).allow("", null),
    location: Joi.string().max(255).allow("", null),
  });
  let checkSchema = Schema.validate(req.body);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });

  let { url, title, start_time, end_time, description, tags, location } = req.body;
  if (start_time >= end_time)
    return res.status(400).send({ error: "Tugash vaqti boshlanish vaqtidan keyin bo'lishi kerak" });

  try {
    let data = await global.pool.query(
      `update calendar set url = $1, title = $2, start_time = $3, end_time = $4,
       description = $5, tags = $6, location = $7 where id = $8`,
      [url || null, title, vaqt(start_time), vaqt(end_time), description, tags || null, location || null, id]
    );
    if (!data.rowCount) return res.status(404).send({ error: "Tadbir topilmadi" });
    res.status(200).send({ edited: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server xatolikga uchradi" });
  }
});

export default router;
