import { Router } from "express";
import { checkToken, get_id } from "../../../functions/jwtDean.js";

const router = Router();

router.get("/", checkToken, async function (req, res) {
  try {
    let deanId = get_id(req, res);
    let data = await global.pool.query(
      `
        select 
dean.email,
dean.login,
dean.firstname,
dean.brithday,
dean.address,
dean.Parent_Name,
dean.lastname,
dean.profil_url,
viloyat.name_uz,
dean.viloyat_id,
tuman.name_uz,
dean.tuman_id

from dean
inner join viloyat on viloyat.id = dean.viloyat_id
inner join tuman on tuman.id = dean.tuman_id
where dean.id = $1`,
      [deanId]
    );

    res.status(200).send(data.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server error" });
  }
});

export default router;
