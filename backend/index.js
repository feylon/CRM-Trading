import express from "express";
import dotenv from "dotenv";


dotenv.config();


const app = express();

app.get("/", function(req, res){
    res.send("salom")
});


app.listen(process.env.PORT, function (){
    console.log("Server ishga tushdi : ", process.env.PORT)
})