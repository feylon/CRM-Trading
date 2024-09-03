import { checkToken } from "../../functions/jwtadmin.js";
import Joi from "joi";
import { Router } from "express";
const router = Router();

function getCustomTimestamp(timestamp) {
  const date = new Date(timestamp );

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

router.post("/", checkToken, async function (req, res) {
  const Schema = Joi.object({
    url: Joi.string().min(3).max(255),
    title: Joi.string().min(3).max(255).required(),
    start_time: Joi.date().timestamp().required(),
    end_time: Joi.date().timestamp().required(),
    description: Joi.string().min(3).max(500).required(),
    tags: Joi.string().min(3).max(255),
    location: Joi.string().min(3).max(255),
  });

  let checkSchema = Schema.validate(req.body);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });

  let { url, title, start_time, end_time, description, tags, location } =
    req.body;
  //   if (!url) url = "";
  //   if (!tags) url = "";
  //   if (!location) location = "";

  if (start_time >= end_time)
    return res.status(400).send({ error: "Noto'g'ri mutonosiblik1" });
  // if (start_time < 1767211261)
  //   return res.status(400).send({ error: "Noto'g'ri mutonosiblik2" });
  // if (end_time > 1767211261)
  //   return res.status(400).send({ error: "Noto'g'ri mutonosiblik3" });
  if (end_time < 1724529661)
    return res.status(400).send({ error: "Noto'g'ri mutonosiblik4" });
  if (start_time < 1724529661)
    return res.status(400).send({ error: "Noto'g'ri mutonosiblik5" });

  start_time = getCustomTimestamp(start_time);
  end_time = getCustomTimestamp(end_time);

  try {
    let data = await global.pool.query(
      `
                        insert into calendar (url, title, start_time, end_time, description, tags, location) values
($1, $2, $3, $4, $5, $6, $7);
                        `,
      [url, title, start_time, end_time, description, tags, location]
    );
    res.status(201).send({ created: "Success :)" });
  } catch (error) {
    res.status(400).send({ error: "Server xatolikga uchradi" });
    console.log(error);
  }
});

export default router;
