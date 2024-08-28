import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import csrf from "csurf";

dotenv.config();
// import files
import Admin from "./Routers/admin/index.js";
import Apeal from "./Routers/Apeal/index.js"
import Calendar from "./Routers/Calendar/index.js";
import CalendarNotification from "./Routers/Notification/index.js";


import pool from "./functions/datatabase.js";
global.pool = pool;

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const csrfProtection = csrf({ cookie: true });


app.get('/form', csrfProtection, (req, res) => {
 console.log(req.csrfToken())
  res.send(`
      <form action="/process" method="POST">
          <input type="hidden" name="_csrf" value="${req.csrfToken()}">
          <button type="submit">Submit</button>
      </form>
  `);
});

app.post('/process', csrfProtection, (req, res) => {
  console.log(req.body)
  // Process the form submission
  res.send('Form successfully submitted with valid CSRF token!');
});
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
      res.status(403);
      res.send('Form tampered with');
  } else {
      next(err);
  }
});







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

Apeal.forEach(element =>{
app.use(`/apeal${element.path}`, element.route);   
});

Calendar.forEach(element =>{
  app.use(`/calendar${element.path}`, element.route);   
  });
  
CalendarNotification.forEach(element =>{
  app.use(`/notification${element.path}`, element.route);   
  });

// another routers
import addApeal from "./Routers/Apeal/add.js";

app.use('/addApeal', addApeal);

const server = http.createServer(app);
server.listen(process.env.PORT, function () {
  console.log("Server ishga tushdi : ", process.env.PORT);
});
