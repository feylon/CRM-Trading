import { hash } from "./bcrypt.js";

let sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitDb(pool, urinish = 20) {
  for (let i = 1; i <= urinish; i++) {
    try {
      await pool.query("select 1");
      console.log("Connected to the database");
      return true;
    } catch (error) {
      console.log(`Bazaga ulanib bo'lmadi (${i}/${urinish}), qayta urinyapman...`);
      await sleep(2000);
    }
  }
  return false;
}

async function seedAdmin(pool) {
  const login = process.env.ADMIN_LOGIN;
  const password = process.env.ADMIN_PASSWORD;
  if (!login || !password) return;
  try {
    let bor = await pool.query("select id from admin where login = $1", [login]);
    if (bor.rows.length) return;
    let parol = await hash(password);
    await pool.query(
      `insert into admin (email, login, password, firstname, lastname)
       values ($1, $2, $3, $4, $5)`,
      [process.env.ADMIN_EMAIL || `${login}@aileet.uz`, login, parol, "Admin", "Aileet"]
    );
    console.log("Default admin yaratildi:", login);
  } catch (error) {
    console.log("Admin seed xatosi:", error.message);
  }
}

export { waitDb, seedAdmin };
