import multer from "multer";
import md5 from "md5";
import { Router } from "express";
import { checkToken, get_id } from "../../../functions/jwtDean.js";
import fs from "fs";

const router = Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "static/profil_pictures");
  },
  filename: function (req, file, cb) {
    let str = file.originalname;
    let ext = str.split(".")[str.split(".").length - 1];
    let url = md5(Date.now()) + "." + ext;
    cb(null, url);
    req.body.file = { url, originalname: file.originalname };
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(file.originalname.toLowerCase());

    if (mimeType && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

router.post("/", [checkToken, upload.single("image")], async (req, res) => {
  const adminId = get_id(req, res);
  // if(!req.body.file.url) return res.status(400).send({error : err.message})
  try {
    let fileurl = await global.pool.query(
      "Select profil_url from  dean where id = $1",
      [adminId]
    );

    fs.unlink(`static/${fileurl.rows[0].profil_url}`, (err) => {});
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    await global.pool.query(
      `
            update dean set profil_url = $1 where id = $2;`,
      ["profil_pictures/" + req.body.file.url, adminId]
    );
    return res.status(200).send({ Edited: true });
  } catch (error) {
    console.log(error);
  }
});

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).send({error : err.message});
  } else if (err) {
    res.status(400).send({error : err.message});
  }
});
export default router;
