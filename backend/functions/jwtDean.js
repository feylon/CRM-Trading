import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function sign(id) {
  return jwt.sign({ id }, process.env.JWT, { expiresIn: "1d" });
}

function checkToken(req, res, next) {
  try {
    jwt.verify(req.header("-x-token"), process.env.JWT);
    next();
  } catch (err) {
    return res.status(401).send({ error: "Error token" });
  }
}

function get_id(req, res) {
  try {
    return jwt.verify(req.header("-x-token"), process.env.JWT).id;
  } catch (err) {
    return res.status(401).send({ error: "Error token" });
  }
}
export { sign, get_id, checkToken };
