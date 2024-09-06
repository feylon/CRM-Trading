import { Router } from "express";
import { checkToken } from "../../functions/jwtadmin.js";
import Joi from "joi";

const router = Router();

router.get("/", checkToken, async function (req, res) {
  let Schema = Joi.object({
    days: Joi.number().integer().min(7).max(90).default(14),
  });
  let checkSchema = Schema.validate(req.query);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });
  let { days } = checkSchema.value;

  try {
    let umumiy = await global.pool.query(`
      select
        count(*) filter (where state = true) as jami,
        count(*) filter (where state = false) as korzinka,
        count(*) filter (where state = true and created_at::date = current_date) as bugun,
        count(*) filter (where state = true and created_at >= date_trunc('week', now())) as hafta,
        count(*) filter (where state = true and created_at >= date_trunc('month', now())) as oy,
        count(*) filter (where state = true and status = 3 and reseen < now()) as kechikkan
      from apeal`);

    let holatlar = await global.pool.query(`
      select apealstatus.id, apealstatus.name, count(apeal.id) as soni
      from apealstatus
      left join apeal on apeal.status = apealstatus.id and apeal.state = true
      group by apealstatus.id, apealstatus.name
      order by apealstatus.id`);

    let kunlik = await global.pool.query(
      `select to_char(d, 'YYYY-MM-DD') as kun, count(apeal.id) as soni
      from generate_series(current_date - ($1::int - 1), current_date, interval '1 day') d
      left join apeal on apeal.created_at::date = d::date and apeal.state = true
      group by d
      order by d`,
      [days]
    );

    let tadbirlar = await global.pool.query(`
      select
        count(*) as jami,
        count(*) filter (where start_time < now() and now() < end_time) as hozir,
        count(*) filter (where start_time between now() and now() + interval '7 day') as yaqin
      from calendar`);

    let oxirgilar = await global.pool.query(`
      select apeal.id, apeal.firstname, apeal.lastname, apeal.phone, apeal.created_at, apealstatus.name as statusname
      from apeal inner join apealstatus on apealstatus.id = apeal.status
      where apeal.state = true
      order by apeal.created_at desc limit 5`);

    let yaqinTadbir = await global.pool.query(`
      select id, title, start_time, end_time, location from calendar
      where end_time > now()
      order by start_time limit 5`);

    let r = umumiy.rows[0];
    let son = (x) => Number(x || 0);
    res.status(200).send({
      apeal: {
        jami: son(r.jami),
        korzinka: son(r.korzinka),
        bugun: son(r.bugun),
        hafta: son(r.hafta),
        oy: son(r.oy),
        kechikkan: son(r.kechikkan),
      },
      holatlar: holatlar.rows.map((i) => ({ id: Number(i.id), name: i.name, soni: son(i.soni) })),
      kunlik: kunlik.rows.map((i) => ({ kun: i.kun, soni: son(i.soni) })),
      tadbir: {
        jami: son(tadbirlar.rows[0].jami),
        hozir: son(tadbirlar.rows[0].hozir),
        yaqin: son(tadbirlar.rows[0].yaqin),
      },
      oxirgilar: oxirgilar.rows,
      yaqinTadbirlar: yaqinTadbir.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server xatolikga uchradi" });
  }
});

export default router;
