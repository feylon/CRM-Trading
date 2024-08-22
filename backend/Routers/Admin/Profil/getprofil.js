import { Router } from "express";
import { checkToken, get_id } from "../../../functions/jwtadmin.js";

const router = Router();

router.get("/", checkToken, async function (req, res) {
  try {
    let adminId = get_id(req, res);
    let data = await global.pool.query(
      `
        select 
admin.email,
admin.login,
admin.firstname,
admin.brithday,
admin.address,
admin.Parent_Name,
admin.lastname,
admin.profil_url
from admin
where admin.id = $1`,
      [adminId]
    );

    res.status(200).send(data.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server error" });
  }
});

export default router;
