import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";

dotenv.config();
// import files
import Admin from "./Routers/admin/index.js";


import pool from "./functions/datatabase.js";
global.pool = pool;

const app = express();
app.use(cors());
app.use(express.json())
app.use(express.static("./static"));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      status: 400,
      message: "Yomon JSON format",
      error: err.message,
    });
  }
  next(err);
});

try {
  await pool.connect();
  console.log("Connect database");
} catch (error) {
  console.log("Database error ", error);
}


Admin.forEach(element =>{
    app.use(`/admin${element.path}`, element.route);   
    });

const server = http.createServer(app);
server.listen(process.env.PORT, function () {
  console.log("Server ishga tushdi : ", process.env.PORT);
});
