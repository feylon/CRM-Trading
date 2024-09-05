import "dotenv/config";
import express from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import http from "http";
import fs from "fs";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit  from "express-rate-limit"

import pgsession from "connect-pg-simple";
import session from "express-session";

const PgSession = pgsession(session);

dotenv.config();

import Admin from "./Routers/Admin/index.js";
import Apeal from "./Routers/Apeal/index.js";
import Calendar from "./Routers/Calendar/index.js";
import CalendarNotification from "./Routers/Notification/index.js";
import addApeal from "./Routers/Apeal/add.js";

import pool from "./functions/datatabase.js";
import { waitDb, seedAdmin } from "./functions/seed.js";
global.pool = pool;

if (!fs.existsSync("./static/profil_pictures"))
  fs.mkdirSync("./static/profil_pictures", { recursive: true });

const app = express();
app.set("trust proxy", 1);

let origins = (process.env.CORS_ORIGIN || "").split(",").map(i => i.trim()).filter(Boolean);
app.use(cors({
  origin : origins.length ? origins : true,
  credentials : true
}));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: 'Ataka o`xshamadimi ?',
});
app.use(limiter);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    store: new PgSession({
      pool: global.pool,
      tableName: "session",
    }),
    secret: process.env.session,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 4 * 60 * 60 * 1000,
      secure: process.env.COOKIE_SECURE === "true",
      httpOnly: true,
      sameSite : "lax"
    },
  })
);

app.use(express.static("./static"));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      status: 400,
      message: "Invalid JSON format",
      error: err.message,
    });
  }
  next(err);
});

app.get("/health", async (req, res) => {
  try {
    await global.pool.query("select 1");
    res.status(200).send({ status: "ok", db: true, time: new Date() });
  } catch (error) {
    res.status(503).send({ status: "fail", db: false });
  }
});

Admin.forEach((element) => {
  app.use(`/admin${element.path}`, element.route);
});

Apeal.forEach((element) => {
  app.use(`/apeal${element.path}`, element.route);
});

Calendar.forEach((element) => {
  app.use(`/calendar${element.path}`, element.route);
});

CalendarNotification.forEach((element) => {
  app.use(`/notification${element.path}`, element.route);
});

app.use("/addApeal", addApeal);

app.use((req, res) => {
  res.status(404).send({ error: "Bunday manzil topilmadi" });
});

app.use((err, req, res, next) => {
  console.log(err);
  if (res.headersSent) return;
  res.status(500).send({ error: "Server xatolikga uchradi" });
});

cron.schedule("0 1 * * *", async () => {
  try {
    await global.pool.query(`delete FROM public.session where expire < NOW()`);
    console.log("Session is cleaned!");
  } catch (error) {}
});

const server = http.createServer(app);

(async () => {
  let ok = await waitDb(pool);
  if (!ok) {
    console.log("Database error: bazaga ulanib bo'lmadi");
    process.exit(1);
  }
  await seedAdmin(pool);
  server.listen(process.env.PORT || 4100, function () {
    console.log("Server is running on:", process.env.PORT || 4100);
  });
})();
