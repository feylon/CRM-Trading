// import express from "express";
// import dotenv from "dotenv";
// import http from "http";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import csrf from "csurf";

// // session
// import pgsession from "connect-pg-simple";
// import session from "express-session";

// const PgSession  = pgsession(session);



// dotenv.config();
// // import files
// import Admin from "./Routers/admin/index.js";
// import Apeal from "./Routers/Apeal/index.js"
// import Calendar from "./Routers/Calendar/index.js";
// import CalendarNotification from "./Routers/Notification/index.js";


// import pool from "./functions/datatabase.js";
// global.pool = pool;

// try {
//   await pool.connect();
//   console.log("Connect database");
// } catch (error) {
//   console.log("Database error ", error);
// }



// const app = express();
// app.use(cors());
// app.use(express.urlencoded({ extended: true }));

// app.use(express.json())

// app.use(cookieParser());
// app.use(cookieParser());

// app.use(
//   session({
//     store: new PgSession({
//       pool: global.pool,
//       tableName: 'session',
//     }),
//     secret: process.env.session,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 30 * 24 * 60 * 60 * 1000,
//       secure: process.env.NODE_ENV === 'production',
//       httpOnly: true,
//     },
//   })
// );
// app.use((req, res, next)=>{
//   console.log(req.session)
//   next();
// })
// app.use(express.static("./static"));

// const csrfProtection = csrf({ cookie: true });





// app.use((err, req, res, next) => {
//   console.log(req.sess)
//   if (err.code === 'EBADCSRFTOKEN') {
//       res.status(403);
//       res.send('Form tampered with');
//   } else {
//       next(err);
//   }
// });







// app.use((err, req, res, next) => {
//   if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
//     return res.status(400).json({
//       status: 400,
//       message: "Yomon JSON format",
//       error: err.message,
//     });
//   }
//   next(err);
// });




// Admin.forEach(element =>{
//     app.use(`/admin${element.path}`, element.route);   
//     });

// Apeal.forEach(element =>{
// app.use(`/apeal${element.path}`, element.route);   
// });

// Calendar.forEach(element =>{
//   app.use(`/calendar${element.path}`, element.route);   
//   });
  
// CalendarNotification.forEach(element =>{
//   app.use(`/notification${element.path}`, element.route);   
//   });

// // another routers
// import addApeal from "./Routers/Apeal/add.js";

// app.use('/addApeal', addApeal);

// const server = http.createServer(app);
// server.listen(process.env.PORT, function () {
//   console.log("Server ishga tushdi : ", process.env.PORT);
// });


import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import csrf from "csurf";

// session
import pgsession from "connect-pg-simple";
import session from "express-session";

const PgSession = pgsession(session);

dotenv.config();

// import files
import Admin from "./Routers/admin/index.js";
import Apeal from "./Routers/Apeal/index.js";
import Calendar from "./Routers/Calendar/index.js";
import CalendarNotification from "./Routers/Notification/index.js";

import pool from "./functions/datatabase.js";
global.pool = pool;

(async () => {
  try {
    await pool.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.log("Database error", error);
  }
})();

const app = express();
app.use(cors());
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
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  })
);


app.use((req, res, next)=>{
  console.log(req.session);
next();
})
app.use(express.static("./static"));

// const csrfProtection = csrf({ cookie: true });
// app.use(csrfProtection);

// app.use((err, req, res, next) => {
//   console.log(req.session);
//   if (err.code === "EBADCSRFTOKEN") {
//     res.status(403);
//     res.send("Form tampered with");
//   } else {
//     next(err);
//   }
// });

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

// another routers
import addApeal from "./Routers/Apeal/add.js";
app.use("/addApeal", addApeal);

const server = http.createServer(app);
server.listen(process.env.PORT, function () {
  console.log("Server is running on:", process.env.PORT);
});
