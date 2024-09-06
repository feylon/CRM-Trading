import { Router } from "express";
import { checkToken } from "../../functions/jwtadmin.js";
import Joi from "joi";
const router = Router();

let listSchema = Joi.object({
  size: Joi.number().integer().min(1).max(100).required(),
  page: Joi.number().integer().min(1).required(),
  search: Joi.string().allow("").max(100),
  status: Joi.number().integer().min(0),
  from: Joi.date(),
  to: Joi.date(),
});

function filterlar(query, state) {
  let where = [`apeal.state = ${state ? "true" : "false"}`];
  let params = [];
  if (query.search && query.search.trim()) {
    params.push(`%${query.search.trim()}%`);
    where.push(`(apeal.firstname ilike $${params.length} or apeal.lastname ilike $${params.length} or apeal.phone ilike $${params.length} or apeal.description ilike $${params.length})`);
  }
  if (query.status) {
    params.push(query.status);
    where.push(`apeal.status = $${params.length}`);
  }
  if (query.from) {
    params.push(query.from);
    where.push(`apeal.created_at >= $${params.length}`);
  }
  if (query.to) {
    params.push(query.to);
    where.push(`apeal.created_at < ($${params.length}::date + 1)`);
  }
  return { where: where.join(" and "), params };
}

async function royxat(req, res, state) {
  let checkSchema = listSchema.validate(req.query);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });
  try {
    const { page, size } = req.query;
    let { where, params } = filterlar(req.query, state);
    let n = params.length;

    let data = await global.pool.query(
      `WITH total AS (
    SELECT COUNT(*) AS total
    FROM apeal
    INNER JOIN apealstatus ON apealstatus.id = apeal.status
    WHERE ${where}
),
paged AS (
    SELECT 
        apeal.id AS id,
        apeal.firstname,
        apeal.lastname,
        apeal.created_at,
        apeal.description,
        apeal.phone,
        apeal.status,
        apeal.reseen,
        apealstatus.id AS status_id,
        apealstatus.name AS statusName,
        apeal.state AS delete,
        (select count(*) from apeal_comment where apeal_comment.apeal_id = apeal.id) as comments
    FROM apeal
    INNER JOIN apealstatus ON apealstatus.id = apeal.status
    WHERE ${where}
    ORDER BY apeal.created_at DESC
    LIMIT $${n + 1} OFFSET ($${n + 2} - 1) * $${n + 1}
)
SELECT 
    paged.*,
    total.total
FROM paged, total;
`,
      [...params, size, page]
    );
    const { rows } = data;
    res.status(200).send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server xatolikga uchradi" });
  }
}

router.get("/all", checkToken, async function (req, res) {
  royxat(req, res, true)
});

router.get("/export", checkToken, async function (req, res) {
  let Schema = Joi.object({
    search: Joi.string().allow("").max(100),
    status: Joi.number().integer().min(0),
    from: Joi.date(),
    to: Joi.date(),
    deleted: Joi.boolean()
  });
  let checkSchema = Schema.validate(req.query);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });
  try {
    let { where, params } = filterlar(req.query, req.query.deleted != "true");
    let data = await global.pool.query(
      `select apeal.id, apeal.lastname, apeal.firstname, apeal.phone, apeal.description,
       apealstatus.name as status, to_char(apeal.created_at, 'YYYY-MM-DD HH24:MI') as created_at,
       to_char(apeal.reseen, 'YYYY-MM-DD') as reseen
       from apeal inner join apealstatus on apealstatus.id = apeal.status
       where ${where}
       order by apeal.created_at desc`,
      params
    );
    let toza = (v) => {
      if (v === null || v === undefined) return "";
      v = String(v).replace(/"/g, '""');
      return `"${v}"`;
    };
    let qatorlar = ["ID;Familiya;Ism;Telefon;Tasnif;Holat;Vaqti;Qayta ko'rish"];
    data.rows.forEach((i) => {
      qatorlar.push([i.id, i.lastname, i.firstname, i.phone, i.description, i.status, i.created_at, i.reseen].map(toza).join(";"));
    });
    let nomi = `murojaatlar_${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${nomi}"`);
    res.status(200).send("\uFEFF" + qatorlar.join("\r\n"));
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server xatolikga uchradi" });
  }
});

router.get("/byid", checkToken, async function (req, res) {
  const Schema = Joi.object({
    id: Joi.number().integer().min(0).required(),
  });
  let checkSchema = Schema.validate(req.query);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });
  const { id } = req.query;
  try {
    let data = await global.pool.query(
      `
            SELECT 
        apeal.id AS id,
        apeal.firstname,
        apeal.lastname,
        apeal.created_at,
        apeal.description,
        apeal.phone,
        apeal.status,
        apeal.reseen,
        apealstatus.id AS status_id,
        apealstatus.name AS statusName
    FROM apeal
    INNER JOIN apealstatus ON apealstatus.id = apeal.status
    where apeal.id = $1
    `,
      [id]
    );
    return res.status(200).send(data.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Server xatolikga uchradi" });
  }
});

router.get("/apealstatus", checkToken, async function (req, res) {
  try {
    let data = await global.pool.query(`
        Select * from apealstatus`);
    return res.status(200).send(data.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Server xatolikga uchradi" });
  }
});




router.get("/corzinca", checkToken, async function (req, res) {
  royxat(req, res, false)
});


export default router;
