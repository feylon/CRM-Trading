import pg from "pg";
const {Pool} = pg;

import dotenv from "dotenv";
dotenv.config();


const {host, user, password, database, databaseport} = process.env;
let pool = new Pool(
    {
        host,
        user,
        password,
        database,
        port : databaseport
    }
);
 


export default  pool;