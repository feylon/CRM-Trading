import pg from "pg";
const {Pool} = pg;

import dotenv from "dotenv";
dotenv.config();


const {host, user, password, database, databaseport} = process.env;
const tz = process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Tashkent";
let pool = new Pool(
    {
        host,
        user,
        password,
        database,
        port : databaseport,
        max : 10,
        options : `-c TimeZone=${tz}`
    }
);

pool.on("error", (err) => {
  console.log("Postgres pool xatosi:", err.message);
});

export default  pool;
