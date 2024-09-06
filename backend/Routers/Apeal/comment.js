import { Router } from "express";
import Joi from "joi";
import { checkToken, get_id } from "../../functions/jwtadmin.js";

const router = Router();

router.get("/:apealId", checkToken, async function (req, res) {
  let Schema = Joi.object({
    apealId: Joi.number().integer().min(1).required(),
  });
  let checkSchema = Schema.validate(req.params);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });

  try {
    let data = await global.pool.query(
      `select apeal_comment.id, apeal_comment.text, apeal_comment.created_at,
admin.firstname, admin.lastname
from apeal_comment
left join admin on admin.id = apeal_comment.admin_id
where apeal_comment.apeal_id = $1
order by apeal_comment.created_at desc`,
      [req.params.apealId]
    );
    res.status(200).send(data.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server xatolikga uchradi" });
  }
});

router.post("/:apealId", checkToken, async function (req, res) {
  let Schema = Joi.object({
    text: Joi.string().trim().min(1).max(1000).required(),
  });
  let checkSchema = Schema.validate(req.body);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });
  let id = Number(req.params.apealId)
  if (!Number.isInteger(id) || id < 1) return res.status(400).send({ error: "id noto'g'ri" });

  try {
    let data = await global.pool.query(
      `insert into apeal_comment (apeal_id, admin_id, text) values ($1, $2, $3) returning id`,
      [id, get_id(req, res), checkSchema.value.text]
    );
    res.status(201).send({ created: true, id: data.rows[0].id });
  } catch (error) {
    if (error.code == "23503") return res.status(400).send({ error: "Murojaat topilmadi" });
    console.log(error);
    res.status(500).send({ error: "Server xatolikga uchradi" });
  }
});

router.delete("/byid/:id", checkToken, async function (req, res) {
  let id = Number(req.params.id)
  if (!Number.isInteger(id) || id < 1) return res.status(400).send({ error: "id noto'g'ri" });
  try {
    let data = await global.pool.query(`delete from apeal_comment where id = $1`, [id]);
    if (!data.rowCount) return res.status(404).send({ error: "Izoh topilmadi" });
    res.status(200).send({ delete: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server xatolikga uchradi" });
  }
});

export default router;
