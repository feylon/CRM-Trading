import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function sign(id) {
  return jwt.sign({ id }, process.env.JWT, { expiresIn: "1d" });
}

function checkToken(req, res, next) {
  if (!req.session || !req.session.IsAdmin) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  next();
}

function get_id(req, res) {
    return req.session.adminId;

}
export { sign, get_id, checkToken };
